import type { Effect, EventContext } from '../types/events.js';

export class EventBus {
  private listeners: Effect[] = [];

  public register(effect: Effect): void {
    this.listeners.push(effect);
    this.listeners.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  }

  public unregister(effect: Effect): void {
    const index = this.listeners.indexOf(effect);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  public emit(ctx: EventContext): void {
    for (const listener of this.listeners) {
      if (listener.eventType === ctx.eventType) {
        listener.handler(ctx);
      }
    }
  }

  public clear(): void {
    this.listeners = [];
  }
}
