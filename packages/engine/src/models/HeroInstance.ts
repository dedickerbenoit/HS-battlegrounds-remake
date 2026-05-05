import type { HeroDefinition } from '../types/hero.js';

export class HeroInstance {
  readonly definition: HeroDefinition;
  currentHp: number;
  armor: number;
  heroPowerUsed: boolean;

  constructor(definition: HeroDefinition) {
    this.definition = definition;
    this.currentHp = definition.baseHp;
    this.armor = definition.armor;
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

  public gainArmor(amount: number): void {
    this.armor = Math.min(this.armor + amount, 5);
  }
}
