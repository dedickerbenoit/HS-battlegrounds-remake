# 001 - Game Rules Specification

## Context

Before writing a single line of code, the first step is to formalize every rule of the game into a clear, unambiguous specification. This document serves as the contract for the entire engine.

## Why it matters

An auto-battler has deceptively complex interactions. Without a written spec:

- Edge cases get discovered too late (e.g. what happens when a player dies mid-shop?)
- Pool math breaks silently (negative copies, leaked cards)
- Combat resolution becomes inconsistent

The spec needs to answer every "what happens when..." before the engine does.

## Key decisions made

### Card pool is finite and shared

Every card exists in a fixed number of copies across all players. This means:

- Buying a card reduces availability for everyone
- Shop rolls are not independent — they depend on global state
- Selling and player death are the only ways cards return

This is the core constraint that makes the game interesting — and the hardest system to implement correctly.

### Ghost system on player death

When a player dies and the remaining count is odd, their last board is preserved as a frozen snapshot. This snapshot:

- Is a deep copy, not a reference
- Does not interact with the pool
- Cannot be modified

This avoids the problem of "who sits out" without introducing byes.

### Damage caps exist

Without caps, early-game snowballing would eliminate players before they can stabilize. The caps scale:

| Turn | Max Damage |
| ---- | ---------- |
| <= 3 | 5          |
| >= 4 | 10         |
| >= 8 | 15         |

And the cap is removed entirely when 4 or fewer players remain.

### Deterministic RNG is non-negotiable

Every random event must be reproducible from a seed. This enables:

- Replay systems
- Debugging (reproduce exact game states)
- Batch simulation (compare balance changes)

## What's next

Translate the spec into TypeScript types and interfaces. Start with `GameState`, `Player`, `Card`, and `Pool`.

## Reference

Full specification: [GAME_RULES.md](../GAME_RULES.md)
