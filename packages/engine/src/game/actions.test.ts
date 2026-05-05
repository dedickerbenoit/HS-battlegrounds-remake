import { describe, it, expect } from 'vitest';
import { GameState } from './GameState.js';
import type { GameConfig } from './GameState.js';
import { ActionType } from './actions.js';
import { GamePhase, Tier, CardType, MinionType } from '../types/enums.js';
import type { HeroDefinition } from '../types/hero.js';
import type { MinionDefinition } from '../types/cards.js';
import { GameEventType } from '../types/events.js';
import { MinionInstance } from '../models/MinionInstance.js';
import { BUY_MINION_COST, SELL_MINION_REFUND, REFRESH_COST, MAX_BOARD_SIZE } from './constants.js';

const HERO_A: HeroDefinition = {
  id: 'hero_a',
  name: 'Hero A',
  baseHp: 40,
  armor: 0,
  heroPower: {
    id: 'hp_a',
    name: 'Power A',
    cost: 2,
    effect: { eventType: GameEventType.OnTurnStart, handler: () => {} },
  },
};

const HERO_B: HeroDefinition = {
  id: 'hero_b',
  name: 'Hero B',
  baseHp: 40,
  armor: 5,
  heroPower: {
    id: 'hp_b',
    name: 'Power B',
    cost: 2,
    effect: { eventType: GameEventType.OnTurnStart, handler: () => {} },
  },
};

const HERO_C: HeroDefinition = {
  id: 'hero_c',
  name: 'Hero C',
  baseHp: 35,
  armor: 3,
  heroPower: {
    id: 'hp_c',
    name: 'Power C',
    cost: 1,
    effect: { eventType: GameEventType.OnTurnStart, handler: () => {} },
  },
};

const HERO_D: HeroDefinition = {
  id: 'hero_d',
  name: 'Hero D',
  baseHp: 45,
  armor: 0,
  heroPower: {
    id: 'hp_d',
    name: 'Power D',
    cost: 0,
    effect: { eventType: GameEventType.OnTurnStart, handler: () => {} },
  },
};

const HERO_E: HeroDefinition = {
  id: 'hero_e',
  name: 'Hero E',
  baseHp: 45,
  armor: 0,
  heroPower: {
    id: 'hp_e',
    name: 'Power E',
    cost: 0,
    effect: { eventType: GameEventType.OnTurnStart, handler: () => {} },
  },
};

const HERO_F: HeroDefinition = {
  id: 'hero_f',
  name: 'Hero F',
  baseHp: 45,
  armor: 0,
  heroPower: {
    id: 'hp_f',
    name: 'Power F',
    cost: 0,
    effect: { eventType: GameEventType.OnTurnStart, handler: () => {} },
  },
};

const HERO_G: HeroDefinition = {
  id: 'hero_g',
  name: 'Hero G',
  baseHp: 45,
  armor: 0,
  heroPower: {
    id: 'hp_g',
    name: 'Power G',
    cost: 0,
    effect: { eventType: GameEventType.OnTurnStart, handler: () => {} },
  },
};

const HERO_H: HeroDefinition = {
  id: 'hero_h',
  name: 'Hero H',
  baseHp: 45,
  armor: 0,
  heroPower: {
    id: 'hp_h',
    name: 'Power H',
    cost: 0,
    effect: { eventType: GameEventType.OnTurnStart, handler: () => {} },
  },
};

const DUMMY_MINION: MinionDefinition = {
  id: 'test_minion',
  name: 'Test Minion',
  cardType: CardType.Minion,
  tier: Tier.One,
  cost: 3,
  baseAttack: 2,
  baseHP: 3,
  minionType: [MinionType.Neutral],
  goldenVersion: false,
};

function makeConfig(): GameConfig {
  return {
    playerSetups: [
      { id: 'p1', name: 'Player 1' },
      { id: 'p2', name: 'Player 2' },
    ],
    seed: 42n,
    heroPool: [HERO_A, HERO_B, HERO_C, HERO_D, HERO_E, HERO_F, HERO_G, HERO_H],
  };
}

function setupRecruitPhase(game: GameState): void {
  game.initialize();
  game.dispatch({ type: ActionType.SelectHero, playerId: 'p1', heroIndex: 0 });
  game.dispatch({ type: ActionType.SelectHero, playerId: 'p2', heroIndex: 0 });
}

describe('SelectHero', () => {
  it('rejects if not in HeroSelection phase', () => {
    const game = new GameState(makeConfig());
    const result = game.dispatch({ type: ActionType.SelectHero, playerId: 'p1', heroIndex: 0 });
    expect(result.success).toBe(false);
  });

  it('selects hero and transitions to Recruit when all selected', () => {
    const game = new GameState(makeConfig());
    game.initialize();

    game.dispatch({ type: ActionType.SelectHero, playerId: 'p1', heroIndex: 0 });
    expect(game.phase).toBe(GamePhase.HeroSelection);

    game.dispatch({ type: ActionType.SelectHero, playerId: 'p2', heroIndex: 1 });
    expect(game.phase).toBe(GamePhase.Recruit);
  });

  it('rejects duplicate selection', () => {
    const game = new GameState(makeConfig());
    game.initialize();

    game.dispatch({ type: ActionType.SelectHero, playerId: 'p1', heroIndex: 0 });
    const result = game.dispatch({ type: ActionType.SelectHero, playerId: 'p1', heroIndex: 1 });
    expect(result.success).toBe(false);
    expect(result.error).toContain('already selected');
  });

  it('rejects invalid hero index', () => {
    const game = new GameState(makeConfig());
    game.initialize();

    const result = game.dispatch({ type: ActionType.SelectHero, playerId: 'p1', heroIndex: 99 });
    expect(result.success).toBe(false);
  });
});

describe('BuyMinion', () => {
  it('buys a minion from the shop', () => {
    const game = new GameState(makeConfig());
    setupRecruitPhase(game);

    const player = game.getPlayer('p1');
    const shopSize = player.shopMinions.length;
    const goldBefore = player.gold;

    const result = game.dispatch({ type: ActionType.BuyMinion, playerId: 'p1', shopIndex: 0 });

    expect(result.success).toBe(true);
    expect(player.gold).toBe(goldBefore - BUY_MINION_COST);
    expect(player.hand.length).toBe(1);
    expect(player.shopMinions.length).toBe(shopSize - 1);
  });

  it('rejects when not enough gold', () => {
    const game = new GameState(makeConfig());
    setupRecruitPhase(game);

    const player = game.getPlayer('p1');
    player.gold = 0;

    const result = game.dispatch({ type: ActionType.BuyMinion, playerId: 'p1', shopIndex: 0 });
    expect(result.success).toBe(false);
    expect(result.error).toContain('gold');
  });

  it('rejects invalid shop index', () => {
    const game = new GameState(makeConfig());
    setupRecruitPhase(game);

    const result = game.dispatch({ type: ActionType.BuyMinion, playerId: 'p1', shopIndex: 99 });
    expect(result.success).toBe(false);
  });
});

describe('SellMinion', () => {
  it('sells a minion from the board', () => {
    const game = new GameState(makeConfig());
    setupRecruitPhase(game);

    const player = game.getPlayer('p1');
    const minion = new MinionInstance(DUMMY_MINION, game.generateInstanceId());
    player.board.push(minion);
    const goldBefore = player.gold;

    const result = game.dispatch({ type: ActionType.SellMinion, playerId: 'p1', boardIndex: 0 });

    expect(result.success).toBe(true);
    expect(player.gold).toBe(goldBefore + SELL_MINION_REFUND);
    expect(player.board.length).toBe(0);
  });
});

describe('PlayCard', () => {
  it('plays a minion from hand to board', () => {
    const game = new GameState(makeConfig());
    setupRecruitPhase(game);

    const player = game.getPlayer('p1');
    const minion = new MinionInstance(DUMMY_MINION, game.generateInstanceId());
    player.hand.push(minion);

    const result = game.dispatch({ type: ActionType.PlayCard, playerId: 'p1', handIndex: 0 });

    expect(result.success).toBe(true);
    expect(player.hand.length).toBe(0);
    expect(player.board.length).toBe(1);
  });

  it('rejects when board is full', () => {
    const game = new GameState(makeConfig());
    setupRecruitPhase(game);

    const player = game.getPlayer('p1');
    for (let i = 0; i < MAX_BOARD_SIZE; i++) {
      player.board.push(new MinionInstance(DUMMY_MINION, game.generateInstanceId()));
    }
    player.hand.push(new MinionInstance(DUMMY_MINION, game.generateInstanceId()));

    const result = game.dispatch({ type: ActionType.PlayCard, playerId: 'p1', handIndex: 0 });
    expect(result.success).toBe(false);
    expect(result.error).toContain('full');
  });
});

describe('RefreshShop', () => {
  it('refreshes the shop for 1 gold', () => {
    const game = new GameState(makeConfig());
    setupRecruitPhase(game);

    const player = game.getPlayer('p1');
    const goldBefore = player.gold;

    const result = game.dispatch({ type: ActionType.RefreshShop, playerId: 'p1' });

    expect(result.success).toBe(true);
    expect(player.gold).toBe(goldBefore - REFRESH_COST);
    expect(player.shopMinions.length).toBeGreaterThan(0);
  });

  it('rejects when no gold', () => {
    const game = new GameState(makeConfig());
    setupRecruitPhase(game);

    game.getPlayer('p1').gold = 0;

    const result = game.dispatch({ type: ActionType.RefreshShop, playerId: 'p1' });
    expect(result.success).toBe(false);
  });
});

describe('FreezeShop', () => {
  it('toggles freeze', () => {
    const game = new GameState(makeConfig());
    setupRecruitPhase(game);

    const player = game.getPlayer('p1');
    expect(player.frozen).toBe(false);

    game.dispatch({ type: ActionType.FreezeShop, playerId: 'p1' });
    expect(player.frozen).toBe(true);

    game.dispatch({ type: ActionType.FreezeShop, playerId: 'p1' });
    expect(player.frozen).toBe(false);
  });
});

describe('UpgradeTavern', () => {
  it('upgrades tavern tier', () => {
    const game = new GameState(makeConfig());
    setupRecruitPhase(game);

    const player = game.getPlayer('p1');
    player.gold = 10;

    const result = game.dispatch({ type: ActionType.UpgradeTavern, playerId: 'p1' });

    expect(result.success).toBe(true);
    expect(player.tavernTier).toBe(Tier.Two);
  });

  it('rejects when not enough gold', () => {
    const game = new GameState(makeConfig());
    setupRecruitPhase(game);

    game.getPlayer('p1').gold = 0;

    const result = game.dispatch({ type: ActionType.UpgradeTavern, playerId: 'p1' });
    expect(result.success).toBe(false);
  });
});

describe('ReorderBoard', () => {
  it('reorders board minions', () => {
    const game = new GameState(makeConfig());
    setupRecruitPhase(game);

    const player = game.getPlayer('p1');
    const m1 = new MinionInstance(DUMMY_MINION, 'a');
    const m2 = new MinionInstance(DUMMY_MINION, 'b');
    const m3 = new MinionInstance(DUMMY_MINION, 'c');
    player.board = [m1, m2, m3];

    const result = game.dispatch({
      type: ActionType.ReorderBoard,
      playerId: 'p1',
      newOrder: [2, 0, 1],
    });

    expect(result.success).toBe(true);
    expect(player.board[0]!.instanceId).toBe('c');
    expect(player.board[1]!.instanceId).toBe('a');
    expect(player.board[2]!.instanceId).toBe('b');
  });

  it('rejects invalid permutation', () => {
    const game = new GameState(makeConfig());
    setupRecruitPhase(game);

    const player = game.getPlayer('p1');
    player.board = [new MinionInstance(DUMMY_MINION, 'a'), new MinionInstance(DUMMY_MINION, 'b')];

    const result = game.dispatch({
      type: ActionType.ReorderBoard,
      playerId: 'p1',
      newOrder: [0, 0],
    });
    expect(result.success).toBe(false);
  });
});

describe('EndTurn', () => {
  it('transitions to combat when all players end turn', () => {
    const game = new GameState(makeConfig());
    setupRecruitPhase(game);

    game.dispatch({ type: ActionType.EndTurn, playerId: 'p1' });
    expect(game.phase).toBe(GamePhase.Recruit);

    game.dispatch({ type: ActionType.EndTurn, playerId: 'p2' });
    expect(game.phase).toBe(GamePhase.Recruit);
    expect(game.turn).toBe(2);
  });
});
