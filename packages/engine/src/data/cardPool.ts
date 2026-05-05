import type { MinionDefinition } from '../types/cards.js';
import { Tier } from '../types/enums.js';
import type { Rng } from '../utils/rng.js';
import { ALL_MINIONS } from './minions/index.js';
import { getMinionById } from './registry.js';

export const POOL_COPIES_PER_TIER: Record<Tier, number> = {
  [Tier.One]: 18,
  [Tier.Two]: 15,
  [Tier.Three]: 13,
  [Tier.Four]: 11,
  [Tier.Five]: 9,
  [Tier.Six]: 6,
};

export const SHOP_MINION_COUNT: Record<Tier, number> = {
  [Tier.One]: 3,
  [Tier.Two]: 4,
  [Tier.Three]: 4,
  [Tier.Four]: 5,
  [Tier.Five]: 5,
  [Tier.Six]: 6,
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
    const drawn: MinionDefinition[] = [];

    for (let d = 0; d < count; d++) {
      const eligible: { minion: MinionDefinition; copies: number }[] = [];
      let totalCopies = 0;
      for (const minion of ALL_MINIONS) {
        if (minion.tier > maxTier) continue;
        const copies = this.pool.get(minion.id) ?? 0;
        if (copies <= 0) continue;
        eligible.push({ minion, copies });
        totalCopies += copies;
      }

      if (totalCopies === 0) break;

      let roll = rng.nextInt(0, totalCopies - 1);
      for (const entry of eligible) {
        roll -= entry.copies;
        if (roll < 0) {
          drawn.push(entry.minion);
          this.pool.set(entry.minion.id, entry.copies - 1);
          break;
        }
      }
    }

    return drawn;
  }

  returnCard(definitionId: string): void {
    const max = POOL_COPIES_PER_TIER[getMinionById(definitionId)?.tier ?? Tier.One];
    const current = this.pool.get(definitionId);
    if (current === undefined) return;
    if (current < max) {
      this.pool.set(definitionId, current + 1);
    }
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
