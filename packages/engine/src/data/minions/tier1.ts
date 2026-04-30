import type { MinionDefinition } from '../../types/cards.js';
import { CardType, MinionType, Tier } from '../../types/enums.js';
import { GameEventType } from '../../types/events.js';
import { Keyword } from '../../types/keywords.js';

export const TIER1_MINIONS: readonly MinionDefinition[] = [
  {
    id: 'BGS_MINION_T1_001',
    name: 'Annoy-o-Tron',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 1,
    baseHP: 2,
    minionType: [MinionType.Mech],
    keywords: [Keyword.Taunt, Keyword.DivineShield],
    goldenVersion: false,
  },
  {
    id: 'BGS_MINION_T1_002',
    name: 'Aureate Laureate',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 1,
    baseHP: 1,
    minionType: [MinionType.Pirate],
    keywords: [Keyword.Battlecry],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnSummon,
        handler: (_ctx) => {
          /* TODO: give a random friendly minion Golden */
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_003',
    name: 'Cord Puller',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 1,
    baseHP: 1,
    minionType: [MinionType.Mech],
    keywords: [Keyword.Deathrattle],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnDeath,
        handler: (_ctx) => {
          /* TODO: Summon a 1 / 1 Microbot */
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_004',
    name: 'CracklingCyclone',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 2,
    baseHP: 1,
    minionType: [MinionType.Elemental],
    keywords: [Keyword.DivineShield, Keyword.Windfury],
    goldenVersion: false,
  },
  {
    id: 'BGS_MINION_T1_005',
    name: 'Dune Dweller',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 3,
    baseHP: 2,
    minionType: [MinionType.Elemental],
    keywords: [Keyword.Battlecry],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnSummon,
        handler: (_ctx) => {
          //TODO: Give Elementals in the Tavern +1/+1 this game.
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_006',
    name: 'Flighty Scout',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 3,
    baseHP: 3,
    minionType: [MinionType.Murloc],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnCombatStart,
        handler: (_ctx) => {
          //TODO: If this minion is in your hand, summon a copy of it.
        },
      },
    ],
  },
];
