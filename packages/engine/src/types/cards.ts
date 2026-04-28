import { CardType, MinionType, Tier } from './enums.js';
import { Keyword } from './keywords.js';
import type { Effect } from './events.js';

export interface CardDefinition {
  id: string;
  name: string;
  cardType: CardType;
  tier: Tier;
  cost: number;
}

export interface MinionDefinition extends CardDefinition {
  baseAttack: number;
  baseHP: number;
  minionType: MinionType[];
  keywords?: Keyword[];
  effects?: Effect[];
  isToken?: boolean;
  goldenVersion: boolean;
}

export interface SpellDefinition extends CardDefinition {
  effect: Effect;
}
