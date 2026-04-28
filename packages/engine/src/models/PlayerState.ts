import type { PlayerConfig } from "../types/player.js";
import { HeroInstance } from "./HeroInstance.js";
import { MinionInstance } from "./MinionInstance.js";
import { SpellInstance } from "./SpellInstance.js";

export class PlayerState {
    config: PlayerConfig;
    hero: HeroInstance;
    hand: (MinionInstance | SpellInstance)[];
    board: MinionInstance[];
    gold: number;
    maxGold: number;
    frozen: boolean;
    shopMinions: MinionInstance[];
    shopSpells: SpellInstance[];
    hpHistory: number[];
    alive: boolean;

    constructor(config: PlayerConfig) {
        this.config = config;
        this.hero = new HeroInstance(config.heroDefinition);
        this.hand = [];
        this.board = [];
        this.gold = 0;
        this.maxGold = 0;
        this.frozen = false;
        this.shopMinions = [];
        this.shopSpells = [];
        this.hpHistory = [this.hero.currentHp];
        this.alive = true;
    }
}