import { describe, it, expect, vi } from 'vitest';
import { EventBus } from './EventBus.js';
import { GameEventType } from '../types/events.js';
import type { Effect, CombatEventContext } from '../types/events.js';
import { MinionInstance } from '../models/MinionInstance.js';
import type { MinionDefinition } from '../types/cards.js';
import { CardType, Tier, MinionType } from '../types/enums.js';

const DUMMY_DEF: MinionDefinition = {
  id: 'test',
  name: 'Test',
  cardType: CardType.Minion,
  tier: Tier.One,
  cost: 3,
  baseAttack: 1,
  baseHP: 1,
  minionType: [MinionType.Neutral],
  goldenVersion: false,
};

function makeCombatCtx(eventType: GameEventType): CombatEventContext {
  const minion = new MinionInstance(DUMMY_DEF, 'inst_1');
  return {
    eventType,
    phase: 'combat',
    source: minion,
    friendlyBoard: [minion],
    enemyBoard: [],
  };
}

describe('EventBus', () => {
  it('calls registered handler on matching event', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    const effect: Effect = { eventType: GameEventType.OnAttack, handler };

    bus.register(effect);
    bus.emit(makeCombatCtx(GameEventType.OnAttack));

    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not call handler on non-matching event', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    const effect: Effect = { eventType: GameEventType.OnDeath, handler };

    bus.register(effect);
    bus.emit(makeCombatCtx(GameEventType.OnAttack));

    expect(handler).not.toHaveBeenCalled();
  });

  it('respects priority order (lower first)', () => {
    const bus = new EventBus();
    const order: number[] = [];

    bus.register({ eventType: GameEventType.OnAttack, handler: () => order.push(3), priority: 3 });
    bus.register({ eventType: GameEventType.OnAttack, handler: () => order.push(1), priority: 1 });
    bus.register({ eventType: GameEventType.OnAttack, handler: () => order.push(2), priority: 2 });

    bus.emit(makeCombatCtx(GameEventType.OnAttack));

    expect(order).toEqual([1, 2, 3]);
  });

  it('unregisters by reference identity', () => {
    const bus = new EventBus();
    const handler = vi.fn();
    const effect: Effect = { eventType: GameEventType.OnAttack, handler };

    bus.register(effect);
    bus.unregister(effect);
    bus.emit(makeCombatCtx(GameEventType.OnAttack));

    expect(handler).not.toHaveBeenCalled();
  });

  it('clear removes all listeners', () => {
    const bus = new EventBus();
    const h1 = vi.fn();
    const h2 = vi.fn();

    bus.register({ eventType: GameEventType.OnAttack, handler: h1 });
    bus.register({ eventType: GameEventType.OnDeath, handler: h2 });
    bus.clear();
    bus.emit(makeCombatCtx(GameEventType.OnAttack));
    bus.emit(makeCombatCtx(GameEventType.OnDeath));

    expect(h1).not.toHaveBeenCalled();
    expect(h2).not.toHaveBeenCalled();
  });

  it('handles multiple listeners for the same event', () => {
    const bus = new EventBus();
    const h1 = vi.fn();
    const h2 = vi.fn();

    bus.register({ eventType: GameEventType.OnSummon, handler: h1 });
    bus.register({ eventType: GameEventType.OnSummon, handler: h2 });
    bus.emit(makeCombatCtx(GameEventType.OnSummon));

    expect(h1).toHaveBeenCalledOnce();
    expect(h2).toHaveBeenCalledOnce();
  });
});
