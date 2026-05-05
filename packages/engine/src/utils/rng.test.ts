import { describe, it, expect } from 'vitest';
import { Rng } from './rng.js';

describe('Rng', () => {
  describe('determinism', () => {
    it('same seed produces identical sequence', () => {
      const a = new Rng(42n);
      const b = new Rng(42n);
      for (let i = 0; i < 100; i++) {
        expect(a.next()).toBe(b.next());
      }
    });

    it('different seeds produce different sequences', () => {
      const a = new Rng(1n);
      const b = new Rng(2n);
      const valuesA = Array.from({ length: 10 }, () => a.next());
      const valuesB = Array.from({ length: 10 }, () => b.next());
      expect(valuesA).not.toEqual(valuesB);
    });
  });

  describe('next', () => {
    it('returns values in [0, 1)', () => {
      const rng = new Rng(123n);
      for (let i = 0; i < 1000; i++) {
        const v = rng.next();
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(1);
      }
    });
  });

  describe('nextInt', () => {
    it('returns values within [min, max] inclusive', () => {
      const rng = new Rng(99n);
      for (let i = 0; i < 500; i++) {
        const v = rng.nextInt(3, 7);
        expect(v).toBeGreaterThanOrEqual(3);
        expect(v).toBeLessThanOrEqual(7);
        expect(Number.isInteger(v)).toBe(true);
      }
    });

    it('returns min when min equals max', () => {
      const rng = new Rng(0n);
      for (let i = 0; i < 10; i++) {
        expect(rng.nextInt(5, 5)).toBe(5);
      }
    });

    it('covers the full range', () => {
      const rng = new Rng(77n);
      const seen = new Set<number>();
      for (let i = 0; i < 500; i++) {
        seen.add(rng.nextInt(0, 4));
      }
      expect(seen).toEqual(new Set([0, 1, 2, 3, 4]));
    });
  });

  describe('shuffle', () => {
    it('does not mutate the original array', () => {
      const rng = new Rng(10n);
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];
      rng.shuffle(original);
      expect(original).toEqual(copy);
    });

    it('returns an array with the same elements', () => {
      const rng = new Rng(10n);
      const input = [1, 2, 3, 4, 5];
      const result = rng.shuffle(input);
      expect(result.sort()).toEqual([1, 2, 3, 4, 5]);
    });

    it('is deterministic with the same seed', () => {
      const a = new Rng(55n);
      const b = new Rng(55n);
      const input = ['a', 'b', 'c', 'd', 'e', 'f'];
      expect(a.shuffle(input)).toEqual(b.shuffle(input));
    });

    it('handles empty array', () => {
      const rng = new Rng(1n);
      expect(rng.shuffle([])).toEqual([]);
    });

    it('handles single-element array', () => {
      const rng = new Rng(1n);
      expect(rng.shuffle([42])).toEqual([42]);
    });
  });

  describe('pick', () => {
    it('returns an element from the array', () => {
      const rng = new Rng(33n);
      const items = ['a', 'b', 'c'];
      for (let i = 0; i < 50; i++) {
        expect(items).toContain(rng.pick(items));
      }
    });

    it('throws on empty array', () => {
      const rng = new Rng(1n);
      expect(() => rng.pick([])).toThrow('Cannot pick from empty array');
    });

    it('returns the only element for single-element array', () => {
      const rng = new Rng(1n);
      expect(rng.pick([99])).toBe(99);
    });
  });

  describe('getState / setState', () => {
    it('saves and restores state for replay', () => {
      const rng = new Rng(42n);
      // Advance a few steps
      for (let i = 0; i < 10; i++) rng.next();

      const savedState = rng.getState();
      const valuesAfterSave = Array.from({ length: 5 }, () => rng.next());

      rng.setState(savedState);
      const replayed = Array.from({ length: 5 }, () => rng.next());

      expect(replayed).toEqual(valuesAfterSave);
    });

    it('getState returns a copy (not a reference)', () => {
      const rng = new Rng(42n);
      const state1 = rng.getState();
      rng.next();
      const state2 = rng.getState();
      expect(state1).not.toEqual(state2);
    });
  });
});
