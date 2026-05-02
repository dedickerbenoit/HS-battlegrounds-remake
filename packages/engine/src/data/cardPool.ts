import type { MinionDefinition } from '../types/cards.js';
import { Tier } from '../types/enums.js';
import type { Rng } from '../utils/rng.js';
import { ALL_MINIONS } from './minions/index.js';

export const POOL_COPIES_PER_TIER: Record<Tier, number> = {
  [Tier.One]: 18,
  [Tier.Two]: 15,
  [Tier.Three]: 13,
  [Tier.Four]: 11,
  [Tier.Five]: 9,
  [Tier.Six]: 6,
  [Tier.Seven]: 6,
};

export const SHOP_MINION_COUNT: Record<Tier, number> = {
  [Tier.One]: 3,
  [Tier.Two]: 4,
  [Tier.Three]: 4,
  [Tier.Four]: 5,
  [Tier.Five]: 5,
  [Tier.Six]: 6,
  [Tier.Seven]: 6,
};

export class CardPool {
  private pool: Map<string, number>;

  constructor() {
    this.pool = new Map();
    for (const minion of ALL_MINIONS) {
      this.pool.set(minion.id, POOL_COPIES_PER_TIER[minion.tier]);
    }
  }

  drawForShop(maxTier: Tier, count: number, rng: Rng): MinionDefinition[] {
    const eligible = ALL_MINIONS.filter((m) => m.tier <= maxTier);
    const bag: MinionDefinition[] = [];
    for (const minion of eligible) {
      const copies = this.pool.get(minion.id) ?? 0;
      for (let i = 0; i < copies; i++) {
        bag.push(minion);
      }
    }

    const drawn: MinionDefinition[] = [];
    const shuffled = rng.shuffle([...bag]);
    for (let i = 0; i < count && i < shuffled.length; i++) {
      const minion = shuffled[i]!;
      drawn.push(minion);
      const current = this.pool.get(minion.id) ?? 0;
      this.pool.set(minion.id, current - 1);
    }

    return drawn;
  }

  returnCard(definitionId: string): void {
    const current = this.pool.get(definitionId) ?? 0;
    this.pool.set(definitionId, current + 1);
  }

  removeCard(definitionId: string): boolean {
    const current = this.pool.get(definitionId) ?? 0;
    if (current <= 0) return false;
    this.pool.set(definitionId, current - 1);
    return true;
  }

  getAvailableCount(definitionId: string): number {
    return this.pool.get(definitionId) ?? 0;
  }

  getTotalCount(): number {
    let total = 0;
    for (const count of this.pool.values()) {
      total += count;
    }
    return total;
  }
}
