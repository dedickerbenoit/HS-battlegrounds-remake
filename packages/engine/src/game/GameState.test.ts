import { describe, it, expect } from 'vitest';
import { GameState } from './GameState.js';
import type { GameConfig } from './GameState.js';
import { ActionType } from './actions.js';
import { GamePhase } from '../types/enums.js';
import { GameEventType } from '../types/events.js';
import type { HeroDefinition } from '../types/hero.js';

function makeHero(id: string, baseHp = 40, armor = 0): HeroDefinition {
  return {
    id,
    name: `Hero ${id}`,
    baseHp,
    armor,
    heroPower: {
      id: `hp_${id}`,
      name: `Power ${id}`,
      cost: 2,
      effect: { eventType: GameEventType.OnTurnStart, handler: () => {} },
    },
  };
}

function makeConfig(playerCount = 2): GameConfig {
  const heroes = [
    makeHero('h1'),
    makeHero('h2'),
    makeHero('h3'),
    makeHero('h4'),
    makeHero('h5'),
    makeHero('h6'),
    makeHero('h7'),
    makeHero('h8'),
  ];
  return {
    playerSetups: Array.from({ length: playerCount }, (_, i) => ({
      id: `p${i + 1}`,
      name: `Player ${i + 1}`,
    })),
    seed: 123n,
    heroPool: heroes,
  };
}

function initAndSelectHeroes(game: GameState): void {
  game.initialize();
  for (const [playerId] of game.players) {
    game.dispatch({ type: ActionType.SelectHero, playerId, heroIndex: 0 });
  }
}

describe('GameState lifecycle', () => {
  it('starts in Init phase', () => {
    const game = new GameState(makeConfig());
    expect(game.phase).toBe(GamePhase.Init);
  });

  it('transitions to HeroSelection on initialize', () => {
    const game = new GameState(makeConfig());
    game.initialize();
    expect(game.phase).toBe(GamePhase.HeroSelection);
  });

  it('offers HEROES_OFFERED heroes to each player', () => {
    const game = new GameState(makeConfig());
    game.initialize();

    for (const [, choices] of game.heroChoices) {
      expect(choices.length).toBe(4);
    }
  });

  it('transitions to Recruit after all heroes selected', () => {
    const game = new GameState(makeConfig());
    initAndSelectHeroes(game);

    expect(game.phase).toBe(GamePhase.Recruit);
    expect(game.turn).toBe(1);
  });

  it('gives correct gold on turn 1', () => {
    const game = new GameState(makeConfig());
    initAndSelectHeroes(game);

    const player = game.getPlayer('p1');
    expect(player.gold).toBe(3);
    expect(player.maxGold).toBe(3);
  });

  it('generates shop on recruit phase', () => {
    const game = new GameState(makeConfig());
    initAndSelectHeroes(game);

    const player = game.getPlayer('p1');
    expect(player.shopMinions.length).toBeGreaterThan(0);
  });

  it('increments upgradeProgress each turn', () => {
    const game = new GameState(makeConfig());
    initAndSelectHeroes(game);

    const player = game.getPlayer('p1');
    expect(player.upgradeProgress).toBe(1);
  });

  it('preserves frozen shop across turns', () => {
    const game = new GameState(makeConfig());
    initAndSelectHeroes(game);

    const player = game.getPlayer('p1');
    game.dispatch({ type: ActionType.FreezeShop, playerId: 'p1' });
    const frozenShopIds = player.shopMinions.map((m) => m.instanceId);

    for (const [playerId] of game.players) {
      game.dispatch({ type: ActionType.EndTurn, playerId });
    }

    const newShopIds = player.shopMinions.map((m) => m.instanceId);
    expect(newShopIds).toEqual(frozenShopIds);
  });

  it('unfreezes after recruit phase starts', () => {
    const game = new GameState(makeConfig());
    initAndSelectHeroes(game);

    game.dispatch({ type: ActionType.FreezeShop, playerId: 'p1' });

    for (const [playerId] of game.players) {
      game.dispatch({ type: ActionType.EndTurn, playerId });
    }

    expect(game.getPlayer('p1').frozen).toBe(false);
  });
});

describe('GameState combat', () => {
  it('resolves combat and increments turn', () => {
    const game = new GameState(makeConfig());
    initAndSelectHeroes(game);
    expect(game.turn).toBe(1);

    for (const [playerId] of game.players) {
      game.dispatch({ type: ActionType.EndTurn, playerId });
    }

    expect(game.turn).toBe(2);
    expect(game.phase).toBe(GamePhase.Recruit);
  });

  it('records hpHistory after combat', () => {
    const game = new GameState(makeConfig());
    initAndSelectHeroes(game);

    for (const [playerId] of game.players) {
      game.dispatch({ type: ActionType.EndTurn, playerId });
    }

    const histories = [...game.players.values()].map((p) => p.hpHistory);
    const hasGrown = histories.some((h) => h.length > 1);
    expect(hasGrown).toBe(true);
  });

  it('tracks lastOpponentId', () => {
    const game = new GameState(makeConfig());
    initAndSelectHeroes(game);

    for (const [playerId] of game.players) {
      game.dispatch({ type: ActionType.EndTurn, playerId });
    }

    const p1 = game.getPlayer('p1');
    const p2 = game.getPlayer('p2');
    expect(p1.lastOpponentId).toBe('p2');
    expect(p2.lastOpponentId).toBe('p1');
  });
});

describe('GameState game end', () => {
  it('ends game when only 1 player remains', () => {
    const game = new GameState(makeConfig());
    initAndSelectHeroes(game);

    const p2 = game.getPlayer('p2');
    p2.hero.currentHp = 1;

    let maxRounds = 50;
    while (game.phase !== GamePhase.End && maxRounds > 0) {
      for (const [playerId] of game.players) {
        const player = game.getPlayer(playerId);
        if (player.alive && game.phase === GamePhase.Recruit) {
          game.dispatch({ type: ActionType.EndTurn, playerId });
        }
      }
      maxRounds--;
    }

    expect(game.phase).toBe(GamePhase.End);
    expect(game.getAlivePlayers().length).toBe(1);
  });
});

describe('GameState determinism', () => {
  it('produces identical games with same seed', () => {
    const config = makeConfig();

    const game1 = new GameState({ ...config });
    initAndSelectHeroes(game1);
    const shop1 = game1.getPlayer('p1').shopMinions.map((m) => m.definition.id);

    const game2 = new GameState({ ...config });
    initAndSelectHeroes(game2);
    const shop2 = game2.getPlayer('p1').shopMinions.map((m) => m.definition.id);

    expect(shop1).toEqual(shop2);
  });
});
