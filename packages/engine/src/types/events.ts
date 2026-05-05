import type { MinionInstance } from '../models/MinionInstance.js';
import type { SpellInstance } from '../models/SpellInstance.js';

export enum GameEventType {
  OnAttack = 'OnAttack',
  OnDamaged = 'OnDamaged',
  OnDeath = 'OnDeath',
  OnSummon = 'OnSummon',
  OnSell = 'OnSell',
  OnBuy = 'OnBuy',
  OnCombatStart = 'OnCombatStart',
  OnCombatEnd = 'OnCombatEnd',
  OnTurnStart = 'OnTurnStart',
  OnTurnEnd = 'OnTurnEnd',

  //passif
  OnBattlecryTriggered = 'OnBattlecryTriggered',
  OnFriendlyMinionDeath = 'OnFriendlyMinionDeath',
  OnGainAttack = 'OnGainAttack',
  OnBuyOtherCard = 'OnBuyOtherCard',
  OnSpellcraft = 'OnSpellcraft',
  OnFriendlyMinionSummon = 'OnFriendlyMinionSummon',
}

export interface Effect {
  eventType: GameEventType;
  handler: (ctx: EventContext) => void;
  priority?: number;
}

interface BaseEventContext {
  eventType: GameEventType;
}

export interface CombatEventContext extends BaseEventContext {
  phase: 'combat';
  source: MinionInstance;
  target?: MinionInstance;
  friendlyBoard: MinionInstance[];
  enemyBoard: MinionInstance[];
}

export interface RecruitEventContext extends BaseEventContext {
  phase: 'recruit';
  source: MinionInstance | SpellInstance;
  target?: MinionInstance | SpellInstance;
  board: MinionInstance[];
  hand: (MinionInstance | SpellInstance)[];
}

export type EventContext = CombatEventContext | RecruitEventContext;
