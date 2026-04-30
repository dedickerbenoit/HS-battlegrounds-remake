import type { MinionDefinition } from '../types/cards.js';
import { CardType, MinionType, Tier } from '../types/enums.js';

export const ALL_TOKENS: readonly MinionDefinition[] = [
  {
    id: 'BGS_TOKEN_001',
    name: 'Microbot',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 0,
    baseAttack: 1,
    baseHP: 1,
    minionType: [MinionType.Mech],
    goldenVersion: false,
    isToken: true,
  },
];
