import type { MinionDefinition } from '../../types/cards.js';
import { TIER1_MINIONS } from './tier1.js';
import { TIER2_MINIONS } from './tier2.js';
import { TIER3_MINIONS } from './tier3.js';
import { TIER4_MINIONS } from './tier4.js';
import { TIER5_MINIONS } from './tier5.js';
import { TIER6_MINIONS } from './tier6.js';

export * from './tier1.js';
export * from './tier2.js';
export * from './tier3.js';
export * from './tier4.js';
export * from './tier5.js';
export * from './tier6.js';

export const ALL_MINIONS: readonly MinionDefinition[] = [
  ...TIER1_MINIONS,
  ...TIER2_MINIONS,
  ...TIER3_MINIONS,
  ...TIER4_MINIONS,
  ...TIER5_MINIONS,
  ...TIER6_MINIONS,
];
