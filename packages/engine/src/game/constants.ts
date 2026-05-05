import { Tier } from '../types/enums.js';

export function goldForTurn(turn: number): number {
  return Math.min(3 + turn - 1, 10);
}

export const BUY_MINION_COST = 3;
export const SELL_MINION_REFUND = 1;
export const REFRESH_COST = 1;

export const MAX_BOARD_SIZE = 7;
export const MAX_HAND_SIZE = 10;

export const MAX_ARMOR = 5;

export const HEROES_OFFERED = 4;

// Cost to upgrade TO this tier. Tier.One excluded (starting tier).
export const TAVERN_UPGRADE_COST: Partial<Record<Tier, number>> = {
  [Tier.Two]: 5,
  [Tier.Three]: 7,
  [Tier.Four]: 8,
  [Tier.Five]: 11,
  [Tier.Six]: 10,
};

export function currentUpgradeCost(baseCost: number, turnsAtTier: number): number {
  return Math.max(0, baseCost - turnsAtTier);
}

export function damageCap(turn: number, alivePlayers: number): number | undefined {
  if (alivePlayers <= 4) return undefined;
  if (turn >= 8) return 15;
  if (turn >= 4) return 10;
  return 5;
}
