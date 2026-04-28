import type { SpellDefinition } from '../types/cards.js';

export class SpellInstance {
  instanceId: string;
  definition: SpellDefinition;

  constructor(instanceId: string, definition: SpellDefinition) {
    this.instanceId = instanceId;
    this.definition = definition;
  }
}
