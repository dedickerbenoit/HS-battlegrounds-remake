import type { Effect } from './events.js';

export interface HeroPowerDefinition {
    id: string;
    name: string;
    cost: number;
    effect: Effect;
}

export interface HeroDefinition {
    id: string;
    name: string;
    baseHp: number;
    armor: number;
    heroPower: HeroPowerDefinition;
}