import { describe, it, expect } from 'vitest';
import { CardPool, POOL_COPIES_PER_TIER } from './cardPool.js';
import { ALL_MINIONS } from './minions/index.js';
import { Tier } from '../types/enums.js';
import { Rng } from '../utils/rng.js';

describe('CardPool', () => {
  it('initializes with correct total count', () => {
    const pool = new CardPool();
    let expected = 0;
    for (const m of ALL_MINIONS) {
      expected += POOL_COPIES_PER_TIER[m.tier];
    }
    expect(pool.getTotalCount()).toBe(expected);
  });

  it('getAvailableCount returns copies per tier', () => {
    const pool = new CardPool();
    expect(pool.getAvailableCount('BGS_MINION_T1_001')).toBe(18);
  });

  it('drawForShop returns requested count', () => {
    const pool = new CardPool();
    const rng = new Rng(42n);
    const shop = pool.drawForShop(Tier.One, 3, rng);
    expect(shop.length).toBe(3);
  });

  it('drawForShop respects maxTier', () => {
    const pool = new CardPool();
    const rng = new Rng(42n);
    const shop = pool.drawForShop(Tier.One, 3, rng);
    for (const card of shop) {
      expect(card.tier).toBe(Tier.One);
    }
  });

  it('drawForShop decrements pool', () => {
    const pool = new CardPool();
    const rng = new Rng(42n);
    const totalBefore = pool.getTotalCount();
    pool.drawForShop(Tier.One, 3, rng);
    expect(pool.getTotalCount()).toBe(totalBefore - 3);
  });

  it('drawForShop is deterministic with same seed', () => {
    const pool1 = new CardPool();
    const pool2 = new CardPool();
    const shop1 = pool1.drawForShop(Tier.Two, 4, new Rng(123n));
    const shop2 = pool2.drawForShop(Tier.Two, 4, new Rng(123n));
    expect(shop1.map((m) => m.id)).toEqual(shop2.map((m) => m.id));
  });

  it('returnCard increments count', () => {
    const pool = new CardPool();
    const rng = new Rng(42n);
    const shop = pool.drawForShop(Tier.One, 1, rng);
    const cardId = shop[0]!.id;
    const countAfterDraw = pool.getAvailableCount(cardId);
    pool.returnCard(cardId);
    expect(pool.getAvailableCount(cardId)).toBe(countAfterDraw + 1);
  });

  it('removeCard returns false when no copies left', () => {
    const pool = new CardPool();
    expect(pool.removeCard('UNKNOWN_CARD')).toBe(false);
  });
});
