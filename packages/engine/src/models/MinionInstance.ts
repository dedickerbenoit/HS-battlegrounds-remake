import type { MinionDefinition } from '../types/cards.js';
import type { Enchantment } from '../types/enchantment.js';
import type { MinionType } from '../types/enums.js';
import type { Keyword } from '../types/keywords.js';

export class MinionInstance {
  readonly instanceId: string;
  readonly definition: MinionDefinition;
  attackModifier: number;
  hpModifier: number;
  currentHp: number;
  keywords: Set<Keyword>;
  minionType: MinionType[];
  golden: boolean;
  enchantments: Enchantment[];

  constructor(definition: MinionDefinition, instanceId: string) {
    this.instanceId = instanceId;
    this.definition = definition;
    this.attackModifier = 0;
    this.hpModifier = 0;
    this.currentHp = definition.baseHP;
    this.keywords = new Set();
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

  public get maxHp(): number {
    return this.definition.baseHP + this.hpModifier;
  }

  public get effectiveAttack(): number {
    return this.definition.baseAttack + this.attackModifier;
  }
}
