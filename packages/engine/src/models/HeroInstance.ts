import type { HeroDefinition } from "../types/hero.js";
import { Tier } from "../types/enums.js";

export class HeroInstance {
    definition: HeroDefinition;
    currentHp: number;
    armor: number;
    tavernTier: Tier;
    heroPowerUsed: boolean;

    constructor(definition: HeroDefinition) {
        this.definition = definition;
        this.currentHp = definition.baseHp;
        this.armor = 0;
        this.tavernTier = 1;
        this.heroPowerUsed = false;
    }

    public takeDamage(amount: number) {
        this.armor = Math.max(0, this.armor - amount);
        const effectiveDamage = Math.max(0, amount - this.armor);
        this.currentHp = Math.max(0, this.currentHp - effectiveDamage);
    }

    public upgradeTavernTier(t: Tier) {
        this.tavernTier = t;
    }

    public isDead(): boolean {
        return this.currentHp <= 0;
    }
}