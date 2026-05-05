import type { MinionDefinition } from '../../types/cards.js';
import { CardType, MinionType, Tier } from '../../types/enums.js';
import { GameEventType } from '../../types/events.js';
import { Keyword } from '../../types/keywords.js';

export const TIER2_MINIONS: readonly MinionDefinition[] = [
  {
    id: 'BGS_MINION_T2_001',
    name: 'Alert Alarmist',
    cardType: CardType.Minion,
    tier: Tier.Two,
    cost: 3,
    baseAttack: 1,
    baseHP: 1,
    minionType: [MinionType.Mech],
    keywords: [Keyword.Taunt, Keyword.Deathrattle],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnDeath,
        handler: (_ctx) => {
          // TODO: The nex Tavern spell you costs (1) less
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T2_002',
    name: 'Ancestral Automaton',
    cardType: CardType.Minion,
    tier: Tier.Two,
    cost: 3,
    baseAttack: 3,
    baseHP: 4,
    minionType: [MinionType.Mech],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnSummon,
        handler: (_ctx) => {
          // TODO: Has +3/+2 for each other Ancestral Automaton you've summoned this game (wherever this is)
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T2_003',
    name: 'Blazing Skyfin',
    cardType: CardType.Minion,
    tier: Tier.Two,
    cost: 3,
    baseAttack: 2,
    baseHP: 4,
    minionType: [MinionType.Murloc, MinionType.Dragon],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnBattlecryTriggered,
        handler: (_ctx) => {
          // TODO: After you trigger a Battlecry, gain +1/+1
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T2_004',
    name: 'Bristleback Bully',
    cardType: CardType.Minion,
    tier: Tier.Two,
    cost: 3,
    baseAttack: 3,
    baseHP: 2,
    minionType: [MinionType.Quilboar],
    keywords: [Keyword.Taunt, Keyword.Deathrattle],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnDeath,
        handler: (_ctx) => {
          // TODO: Get a Blood Gem that also gives a Quilboar Taunt.
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T2_005',
    name: 'Defiant Shipwright',
    cardType: CardType.Minion,
    tier: Tier.Two,
    cost: 3,
    baseAttack: 2,
    baseHP: 5,
    minionType: [MinionType.Pirate],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnGainAttack,
        handler: (_ctx) => {
          // TODO: Whenever this gains Attack from other sources, gain +1 Health.
        },
      },
    ],
  },
  {
    id: 'BGS_MINION_T2_006',
    name: 'Eternal Knight',
    cardType: CardType.Minion,
    tier: Tier.Two,
    cost: 3,
    baseAttack: 4,
    baseHP: 2,
    minionType: [MinionType.Undead],
    goldenVersion: false,
    effects: [
      {
        eventType: GameEventType.OnFriendlyMinionDeath,
        handler: (_ctx) => {
          //TODO: check if dead minion is Eternal Knight, if so gain +4/+2.
        },
      },
    ],
  },
];
