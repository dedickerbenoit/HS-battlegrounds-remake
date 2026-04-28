import type { MinionDefinition } from '../types/cards.js';
import type { MinionType } from '../types/enums.js';
import type { Keyword } from '../types/keywords.js';

export class MinionInstance {
  instanceId: string;
  definition: MinionDefinition;
  attackModifier: number;
  hpModifier: number;
  currentHp: number;
  keywords: Keyword[];
  minionType: MinionType;
  golden: boolean;
  enchantments: string[]; // serait bien d'avoir un typage plus précis pour les enchantements.

  constructor(definition: MinionDefinition, instanceId: string) {
    this.instanceId = instanceId;
    this.definition = definition;
    this.attackModifier = 0;
    this.hpModifier = 0;
    this.currentHp = definition.baseHP;
    this.keywords = [];
    this.minionType = definition.minionType;
    this.golden = false;
    this.enchantments = [];
  }

  public takeDamage(amount: number) {
    this.currentHp = Math.max(0, this.currentHp - amount);
  }

  public applyBuff(attackBuff: number, hpBuff: number) {
    this.attackModifier += attackBuff;
    this.hpModifier += hpBuff;
    this.currentHp += hpBuff;
  }

  public resetForCombat() {
    this.currentHp = this.definition.baseHP + this.hpModifier;
  }
}
