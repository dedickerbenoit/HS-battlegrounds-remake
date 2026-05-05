import { CardPool, SHOP_MINION_COUNT } from '../data/cardPool.js';
import { MinionInstance } from '../models/MinionInstance.js';
import { PlayerState } from '../models/PlayerState.js';
import { GamePhase, type Tier } from '../types/enums.js';
import type { HeroDefinition } from '../types/hero.js';
import type { PlayerConfig } from '../types/player.js';
import { Rng } from '../utils/rng.js';
import {
  handleBuyMinion,
  handleBuySpell,
  handleEndTurn,
  handleFreezeShop,
  handlePlayCard,
  handleRefreshShop,
  handleReorderBoard,
  handleSelectHero,
  handleSellMinion,
  handleUpgradeTavern,
} from './actionHandlers.js';
import { ActionType, type ActionResult, type GameAction, type GamePlayerSetup } from './actions.js';
import { damageCap, goldForTurn, HEROES_OFFERED } from './constants.js';
import { EventBus } from './EventBus.js';

export interface GameConfig {
  playerSetups: GamePlayerSetup[];
  seed: bigint;
  heroPool?: HeroDefinition[];
}

export interface GhostSnapshot {
  playerId: string;
  board: MinionInstance[];
  tavernTier: Tier;
}

export class GameState {
  config: GameConfig;
  rng: Rng;
  cardPool: CardPool;
  eventBus: EventBus;
  phase: GamePhase;
  turn: number;
  players: Map<string, PlayerState>;
  heroChoices: Map<string, HeroDefinition[]>;
  heroSelected: Set<string>;
  turnReadyPlayers: Set<string>;
  ghosts: GhostSnapshot[];
  combatPairings: [string, string][];
  private _nextInstanceId: number;

  constructor(config: GameConfig) {
    this.config = config;
    this.rng = new Rng(config.seed);
    this.cardPool = new CardPool();
    this.eventBus = new EventBus();
    this.phase = GamePhase.Init;
    this.turn = 0;
    this.players = new Map();
    this.heroChoices = new Map();
    this.heroSelected = new Set();
    this.turnReadyPlayers = new Set();
    this.ghosts = [];
    this.combatPairings = [];
    this._nextInstanceId = 1;
  }

  public initialize(): void {
    const heroPool = this.config.heroPool;
    if (!heroPool || heroPool.length < HEROES_OFFERED) {
      throw new Error(`Hero pool must contain at least ${HEROES_OFFERED} heroes`);
    }

    for (const setup of this.config.playerSetups) {
      const dummyConfig: PlayerConfig = {
        id: setup.id,
        name: setup.name,
        heroDefinition: heroPool[0]!,
        ...(setup.isBot != null && { isBot: setup.isBot }),
      };
      this.players.set(setup.id, new PlayerState(dummyConfig));
    }

    const shuffledHeroes = this.rng.shuffle(heroPool);
    let heroIndex = 0;
    for (const setup of this.config.playerSetups) {
      const offered = shuffledHeroes.slice(heroIndex, heroIndex + HEROES_OFFERED);
      this.heroChoices.set(setup.id, offered);
      heroIndex += HEROES_OFFERED;
    }

    this.phase = GamePhase.HeroSelection;
  }

  public startRecruitPhase(): void {
    this.turn++;
    this.turnReadyPlayers.clear();
    this.phase = GamePhase.Recruit;

    for (const player of this.getAlivePlayers()) {
      const maxGold = goldForTurn(this.turn);
      player.maxGold = maxGold;
      player.gold = maxGold;

      player.upgradeProgress++;

      if (!player.frozen) {
        this.returnShopToPool(player);
        this.generateShop(player);
      }
      player.frozen = false;
    }
  }

  public startCombatPhase(): void {
    this.phase = GamePhase.Combat;

    for (const player of this.getAlivePlayers()) {
      for (const minion of player.board) {
        minion.resetForCombat();
      }
    }

    this.combatPairings = this.generatePairings();

    this.resolveCombat();

    if (this.checkGameEnd()) {
      this.phase = GamePhase.End;
      return;
    }

    this.startRecruitPhase();
  }

  public resolveCombat(): void {
    const aliveCount = this.getAlivePlayers().length;
    for (const [idA, idB] of this.combatPairings) {
      const playerA = this.players.get(idA);
      const playerB = this.players.get(idB);

      if (!playerA || !playerB) continue;

      // temp
      const flip = this.rng.nextInt(0, 1);
      const winner = flip === 0 ? playerA : playerB;
      const loser = flip === 0 ? playerB : playerA;

      let damage = winner.tavernTier;

      const cap = damageCap(this.turn, aliveCount);
      if (cap !== undefined) {
        damage = Math.min(damage, cap);
      }

      loser.hero.takeDamage(damage);

      loser.hpHistory.push(loser.hero.currentHp);
      winner.hpHistory.push(winner.hero.currentHp);

      if (loser.hero.isDead()) {
        loser.alive = false;
        this.saveGhost(loser);
        this.returnPlayerCardsToPool(loser);
      }

      playerA.lastOpponentId = idB;
      playerB.lastOpponentId = idA;
    }
  }

  public checkGameEnd(): boolean {
    return this.getAlivePlayers().length <= 1;
  }

  public dispatch(action: GameAction): ActionResult {
    switch (action.type) {
      case ActionType.SelectHero:
        return handleSelectHero(this, action);
      case ActionType.BuyMinion:
        return handleBuyMinion(this, action);
      case ActionType.BuySpell:
        return handleBuySpell(this, action);
      case ActionType.SellMinion:
        return handleSellMinion(this, action);
      case ActionType.PlayCard:
        return handlePlayCard(this, action);
      case ActionType.RefreshShop:
        return handleRefreshShop(this, action);
      case ActionType.FreezeShop:
        return handleFreezeShop(this, action);
      case ActionType.UpgradeTavern:
        return handleUpgradeTavern(this, action);
      case ActionType.ReorderBoard:
        return handleReorderBoard(this, action);
      case ActionType.EndTurn:
        return handleEndTurn(this, action);
    }
  }

  public getPlayer(id: string): PlayerState {
    const player = this.players.get(id);
    if (!player) throw new Error(`Player ${id} not found`);
    return player;
  }

  public getAlivePlayers(): PlayerState[] {
    return [...this.players.values()].filter((p) => p.alive);
  }

  public generateShop(player: PlayerState): void {
    const count = SHOP_MINION_COUNT[player.tavernTier];
    const drawn = this.cardPool.drawForShop(player.tavernTier, count, this.rng);
    player.shopMinions = drawn.map((def) => new MinionInstance(def, this.generateInstanceId()));
  }

  public returnShopToPool(player: PlayerState): void {
    for (const minion of player.shopMinions) {
      this.cardPool.returnCard(minion.definition.id);
    }
    player.shopMinions = [];
  }

  public generateInstanceId(): string {
    return `inst_${this._nextInstanceId++}`;
  }

  private generatePairings(): [string, string][] {
    const alive = this.getAlivePlayers();
    const ids = this.rng.shuffle(alive.map((p) => p.config.id));
    const pairings: [string, string][] = [];

    for (let i = 0; i + 1 < ids.length; i += 2) {
      const a = ids[i]!;
      const b = ids[i + 1]!;
      const playerA = this.getPlayer(a);
      if (playerA.lastOpponentId === b && i + 2 < ids.length) {
        ids[i + 1] = ids[i + 2]!;
        ids[i + 2] = b;
      }
      pairings.push([ids[i]!, ids[i + 1]!]);
    }

    if (ids.length % 2 === 1) {
      const oddPlayer = ids[ids.length - 1]!;
      if (this.ghosts.length > 0) {
        // TODO: Ghost combat — odd player should fight ghost board.
        // Currently skipped in resolveCombat (playerB = undefined → continue)
        pairings.push([oddPlayer, `ghost_${this.ghosts.length - 1}`]);
      }
    }

    return pairings;
  }

  private returnPlayerCardsToPool(player: PlayerState): void {
    for (const minion of player.board) {
      this.cardPool.returnCard(minion.definition.id);
    }
    for (const card of player.hand) {
      if (card instanceof MinionInstance) {
        this.cardPool.returnCard(card.definition.id);
      }
    }
    this.returnShopToPool(player);
    player.board = [];
    player.hand = [];
  }

  private saveGhost(player: PlayerState): void {
    this.ghosts.push({
      playerId: player.config.id,
      board: player.board.map((m) => new MinionInstance(m.definition, this.generateInstanceId())),
      tavernTier: player.tavernTier,
    });
  }
}
