import type { HeroDefinition } from './hero.js';

export interface PlayerConfig {
    id: string;
    name: string;
    heroDefinition: HeroDefinition;
}