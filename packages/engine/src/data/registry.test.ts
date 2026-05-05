import { describe, it, expect } from 'vitest';
import { ALL_MINIONS } from './minions/index.js';
import { ALL_SPELLS } from './spells.js';
import { ALL_TOKENS } from './tokens.js';
import { CardType, Tier } from '../types/enums.js';
import {
  getMinionById,
  getMinionsByTier,
  getSpellById,
  getTokenById,
  makeGolden,
} from './registry.js';

describe('Card definitoins integrity', () => {
  it('no duplication IDs across all definitions', () => {
    const allIds = [
      ...ALL_MINIONS.map((m) => m.id),
      ...ALL_SPELLS.map((s) => s.id),
      ...ALL_TOKENS.map((t) => t.id),
    ];

    const unique = new Set(allIds);
    expect(unique.size).toBe(allIds.length);
  });

  it('all minions have cardType Minion and cost 3', () => {
    for (const m of ALL_MINIONS) {
      expect(m.cardType).toBe(CardType.Minion);
      expect(m.cost).toBe(3);
    }
  });

  it('all tokens avec isToken true', () => {
    for (const t of ALL_TOKENS) {
      expect(t.isToken).toBe(true);
    }
  });

  it('tokens are not in ALL_MINIONS', () => {
    const minionIds = new Set(ALL_MINIONS.map((m) => m.id));
    for (const t of ALL_TOKENS) {
      expect(minionIds.has(t.id)).toBe(false);
    }
  });

  describe('Registry lookups', () => {
    it('getMinionById returns correct minion', () => {
      const minion = getMinionById('BGS_MINION_T1_001');
      expect(minion).toBeDefined();
      expect(minion!.name).toBe('Annoy-o-Tron');
    });

    it('getMinionById returns undefined for non existing id', () => {
      const minion = getMinionById('NON_EXISTING_ID');
      expect(minion).toBeUndefined();
    });

    it('getSpellByID returns correct spell', () => {
      const spell = getSpellById('BGS_SPELL_T1_001');
      expect(spell).toBeDefined();
      expect(spell!.name).toBe('A New Sprout');
    });

    it('getTokenById returns correct token', () => {
      const token = getTokenById('BGS_TOKEN_001');
      expect(token).toBeDefined();
      expect(token!.isToken).toBe(true);
    });

    it('getMinionsByTIer returns correct count', () => {
      const tier1 = getMinionsByTier(Tier.One);
      expect(tier1.length).toBeGreaterThanOrEqual(22);
      for (const m of tier1) {
        expect(m.tier).toBe(Tier.One);
      }
    });
  });
});

describe('makeGolden', () => {
  it('doubles stats and sets goldenVersion true', () => {
    const base = getMinionById('BGS_MINION_T1_001')!;
    const golden = makeGolden(base);
    expect(golden.baseAttack).toBe(base.baseAttack * 2);
    expect(golden.baseHP).toBe(base.baseHP * 2);
    expect(golden.goldenVersion).toBe(true);
    expect(golden.id).toBe(`golden_${base.id}`);
  });

  it('keeps the same name', () => {
    const base = getMinionById('BGS_MINION_T1_001')!;
    const golden = makeGolden(base);
    expect(golden.name).toBe(base.name);
  });
});
