import type { HeroDefinition } from '../types/hero.js';

export class HeroInstance {
  readonly definition: HeroDefinition;
  currentHp: number;
  armor: number;
  heroPowerUsed: boolean;

  constructor(definition: HeroDefinition) {
    this.definition = definition;
    this.currentHp = definition.baseHp;
    this.armor = 0;
    this.heroPowerUsed = false;
  }

  public takeDamage(amount: number) {
    const absorbed = Math.min(this.armor, amount);
    this.armor -= absorbed;
    this.currentHp -= amount - absorbed;
  }

  public isDead(): boolean {
    return this.currentHp <= 0;
  }
}
