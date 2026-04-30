import type { MinionDefinition, SpellDefinition } from '../types/cards.js';
import type { Tier } from '../types/enums.js';
import { ALL_MINIONS } from './minions/index.js';
import { ALL_SPELLS } from './spells.js';
import { ALL_TOKENS } from './tokens.js';

const MINION_BY_ID = new Map<string, MinionDefinition>(ALL_MINIONS.map((m) => [m.id, m]));

const TOKEN_BY_ID = new Map<string, MinionDefinition>(ALL_TOKENS.map((t) => [t.id, t]));

const SPELL_BY_ID = new Map<string, SpellDefinition>(ALL_SPELLS.map((s) => [s.id, s]));

export function getMinionById(id: string): MinionDefinition | undefined {
  return MINION_BY_ID.get(id);
}

export function getTokenById(id: string): MinionDefinition | undefined {
  return TOKEN_BY_ID.get(id);
}

export function getSpellById(id: string): SpellDefinition | undefined {
  return SPELL_BY_ID.get(id);
}

export function getMinionsByTier(tier: Tier): readonly MinionDefinition[] {
  return ALL_MINIONS.filter((m) => m.tier === tier);
}

export function getSpellsByTier(tier: Tier): readonly SpellDefinition[] {
  return ALL_SPELLS.filter((s) => s.tier === tier);
}

export function makeGolden(def: MinionDefinition): MinionDefinition {
  return {
    ...def,
    id: `golden_${def.id}`,
    name: def.name,
    baseAttack: def.baseAttack * 2,
    baseHP: def.baseHP * 2,
    goldenVersion: true,
  };
}
