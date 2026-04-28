export enum GameEventType {
    OnAttack,
    OnDamaged,
    OnDeath,
    OnSummon,
    OnSell,
    OnBuy,
    OnCombatStart,
    OnCombatEnd,
    OnTurnStart,
    OnTurnEnd,
}

export interface Effect {
    eventType: GameEventType;
    handler: (ctx: EventContext) => void;
    priority?: number;
}

export interface EventContext {
    source: unknown,
    target?: unknown,
    board: unknown[],
}
