import type { SpellDefinition } from '../types/cards.js';

export class SpellInstance {
  readonly instanceId: string;
  readonly definition: SpellDefinition;

  constructor(instanceId: string, definition: SpellDefinition) {
    this.instanceId = instanceId;
    this.definition = definition;
  }
}
