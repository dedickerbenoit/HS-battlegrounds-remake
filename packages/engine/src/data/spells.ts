import type { SpellDefinition } from '../types/cards.js';
import { CardType, Tier } from '../types/enums.js';
import { GameEventType } from '../types/events.js';

export const ALL_SPELLS: readonly SpellDefinition[] = [
  {
    id: 'BGS_SPELL_T1_001',
    name: 'A New Sprout',
    cardType: CardType.Spell,
    tier: Tier.One,
    cost: 3,
    effect: {
      eventType: GameEventType.OnSummon,
      handler: (_ctx) => {
        // TODO: Discover a Tier 1 Minion.
      },
    },
  },
  {
    id: 'BGS_SPELL_T1_002',
    name: 'Enchanted Lasso',
    cardType: CardType.Spell,
    tier: Tier.One,
    cost: 2,
    effect: {
      eventType: GameEventType.OnSummon,
      handler: (_ctx) => {
        // TODO: Steal a random minion form the Tavern
      },
    },
  },
];
