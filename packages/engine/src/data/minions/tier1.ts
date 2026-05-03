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
  {
    id: 'BGS_MINION_T1_007',
    name: 'Gluttonous Trogg',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 2,
    baseHP: 3,
    minionType: [MinionType.Neutral],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnBuyOtherCard,
        handler: (_ctx) => {
          //TODO: Once you buy 4 cards, gain +4/+4
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_008',
    name: 'Harmless Bonehead',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 1,
    baseHP: 1,
    minionType: [MinionType.Undead],
    keywords: [Keyword.Deathrattle],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnDeath,
        handler: (_ctx) => {
          /* TODO: Summon a 1/1 Skeleton */
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_009',
    name: 'Manasaber',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 4,
    baseHP: 1,
    minionType: [MinionType.Beast],
    keywords: [Keyword.Deathrattle],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnDeath,
        handler: (_ctx) => {
          // TODO: summon two 0/1 Cublings with Taunt
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_010',
    name: 'Ominous Seer',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 2,
    baseHP: 1,
    minionType: [MinionType.Naga, MinionType.Demon],
    keywords: [Keyword.Battlecry],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnSummon,
        handler: (_ctx) => {
          // TODO: The next Tavern spell you buy costs (1) less
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_011',
    name: 'Picky Eater',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 1,
    baseHP: 1,
    minionType: [MinionType.Demon],
    keywords: [Keyword.Battlecry],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnSummon,
        handler: (_ctx) => {
          // Consume a random minion in the Tavern to gain its stats.
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_012',
    name: 'Razorfen Geomancer',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 2,
    baseHP: 1,
    minionType: [MinionType.Quilboar],
    keywords: [Keyword.Battlecry],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnSummon,
        handler: (_ctx) => {
          // TODO: Gain two Blood Gems
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_013',
    name: 'Risen Raider',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 2,
    baseHP: 1,
    minionType: [MinionType.Undead],
    keywords: [Keyword.Taunt, Keyword.Reborn],
    goldenVersion: false,
  },
  {
    id: 'BGS_MINION_T1_014',
    name: 'River Skipper',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 1,
    baseHP: 1,
    minionType: [MinionType.Murloc],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnSell,
        handler: (_ctx) => {
          // TODO: when you sell this, get a random  Tier 1 minion
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_015',
    name: 'Rot Hide Gnoll',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 1,
    baseHP: 4,
    minionType: [MinionType.Undead],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnFriendlyMinionDeath,
        handler: (_ctx) => {
          //TODO: Has 1 Attack for each friendly minion that died this combat.
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_016',
    name: 'Scarlet Survivor',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 3,
    baseHP: 3,
    minionType: [MinionType.Dragon],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnGainAttack,
        handler: (_ctx) => {
          // TODO: One this reaches 6 Attack, gain Divine Shield.
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_017',
    name: 'SouthSea Busker',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 3,
    baseHP: 1,
    minionType: [MinionType.Pirate],
    keywords: [Keyword.Battlecry],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnSummon,
        handler: (_ctx) => {
          // TODO: Gain 1 Gold next turn
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_018',
    name: 'Sun-Bacon Relaxer',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 2,
    baseHP: 3,
    minionType: [MinionType.Quilboar],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnSell,
        handler: (_ctx) => {
          // TODO: When you sell this, get 2 Blood Gems.
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_019',
    name: "Surf n'Surf",
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 1,
    baseHP: 1,
    minionType: [MinionType.Beast, MinionType.Naga],
    keywords: [Keyword.Spellcraft],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnSpellcraft,
        handler: (_ctx) => {
          // Spellcraft: Give a minion "Deathrattle: Summon a 3/2 Crab" until next turn
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_020',
    name: 'Twilight Hatchling',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 1,
    baseHP: 1,
    minionType: [MinionType.Dragon],
    keywords: [Keyword.Deathrattle],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnDeath,
        handler: (_ctx) => {
          //TODO: Summon a 3/3 Whelp that attacks immediately.
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_021',
    name: 'Upbeat FrontDrake',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 1,
    baseHP: 1,
    minionType: [MinionType.Dragon],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnTurnEnd,
        handler: (_ctx) => {
          // TODO: At the end of every 3 turns, get a random Dragon. (X turns left)
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T1_022',
    name: 'Wrath Weaver',
    cardType: CardType.Minion,
    tier: Tier.One,
    cost: 3,
    baseAttack: 1,
    baseHP: 4,
    minionType: [MinionType.Demon],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnFriendlyMinionSummon,
        handler: (_ctx) => {
          // TODO: After you play  a Demon, deal 1 damage, to your Hero and gain +2/+1
        },
      },
    ],
  },
];
