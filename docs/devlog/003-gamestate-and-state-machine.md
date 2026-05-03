# 003 - GameState & State Machine

## Context

With types and runtime models in place, the next step is to build
the game engine foundations: the system that orchestrates a full game
from start to finish.

This involves 4 interdependent subsystems:

1. A deterministic RNG (same seed = same game)
2. A card catalog (static definitions)
3. A shared pool (finite copy management)
4. A GameState with state machine (phase orchestration)

## 1. Deterministic RNG

### The problem

`Math.random()` offers no seed control and no state access.
Impossible to reproduce a game or write reliable tests.

### The solution

Implementation of xoshiro256\*\* — a fast PRNG with 256-bit state.

- **SplitMix64** initializes the 4 state words from a single seed
- **rotl** (64-bit left rotation) mixes bits at each iteration
- **BigInt** with 64-bit mask to simulate unsigned arithmetic

### API

- `next()` — float in [0, 1]
- `nextInt(min, max)` — uniform integer in [min, max]
- `shuffle(array)` — Fisher-Yates in-place
- `pick(array)` — random element
- `getState() / setState()` — snapshot/restore for replay

### Decisions

- BigInt required: JS only has 53 bits of integer precision in
  `number`, xoshiro256\*\* needs 64
- Seed incremented (not chained) for initialization: each state
  word is derived independently
- `noUncheckedIndexedAccess` forces `!` assertions on array access
  — justified since indices are always in bounds

### Challenges

Working with bitwise operations in JavaScript was the main difficulty.

**64-bit arithmetic with BigInt**
JavaScript numbers are 64-bit floats with only 53 bits of integer
precision. xoshiro256\*\* requires true 64-bit unsigned integer math.
Every operation must use BigInt and be masked with
`& 0xFFFFFFFFFFFFFFFFn` to prevent overflow beyond 64 bits.

**Bitwise operators on BigInt**
Standard bitwise operators (`^`, `<<`, `>>`, `|`) work on BigInt
but behave differently than on regular numbers — BigInt has no fixed
width, so without masking, bits grow indefinitely.

**Compound assignment (`^=`)**
`state[2] ^= state[0]` is shorthand for
`state[2] = state[2] ^ state[0]`. The XOR operation flips bits
where the two operands differ. This is how the algorithm mixes
state words together — each word influences the others, ensuring
the sequence doesn't fall into short cycles.

**Bit rotation (`rotl`)**
Unlike a shift (which loses bits on one side), a rotation wraps them
around: bits pushed out on the left come back on the right.
`rotl(x, k) = (x << k) | (x >> (64n - k))` — the OR combines the
left-shifted part with the bits that wrapped around.

**Conversion to float**
The final step strips the result from 64 bits to 53 (JavaScript's
float precision) via `result >> 11n`, then divides by 2^53 to get
a number in [0, 1]. The 11 least significant bits are discarded
because they contribute the least to randomness quality.

## 2. Card definitions

### The problem

The engine needs a catalog of every card in the game — minions, spells,
and tokens — that serves as the single source of truth. Without it,
card data would be scattered or hardcoded in game logic.

### The solution

A registry system with three layers:

1. **Definition arrays** — Static data organized by tier
   (`TIER1_MINIONS`, `ALL_SPELLS`, `ALL_TOKENS`)
2. **Registry maps** — O(1) lookups by ID
   (`getMinionById`, `getSpellById`, `getTokenById`)
3. **Utility functions** — `getMinionsByTier`, `getSpellsByTier`,
   `makeGolden` (doubles stats, prefixes ID)

### Card structure

All cards follow the `CardDefinition` base interface:

- `id` — Unique identifier (e.g. `BGS_MINION_T1_001`)
- `name` — Display name
- `cardType` — `Minion` or `Spell`
- `tier` — Tavern tier (One through Six)
- `cost` — Buy cost (always 3 for minions, varies for spells)

Minions extend this with `baseAttack`, `baseHP`, `minionType[]`,
`keywords[]`, `effects[]`, `isToken`, and `goldenVersion`.

### Decisions

- **Naming convention**: `BGS_MINION_T{tier}_{number}` for minions,
  `BGS_TOKEN_{number}` for tokens, `BGS_SPELL_T{tier}_{number}` for spells
- **Multi-tribe as array**: `minionType: MinionType[]` handles dual-tribe
  minions like Surf n'Surf (Beast/Naga)
- **Tokens separated**: Tokens have `isToken: true` and live in their own
  array, never entering the shared pool
- **Effects as stubs**: Every minion effect is declared with the correct
  `eventType` but the handler is a `// TODO:` placeholder — effects will
  be implemented when combat resolution is built
- **`makeGolden` is a function, not data**: Golden versions are computed
  (double stats, prefix ID) rather than stored as separate definitions.
  This avoids maintaining parallel card lists

### Current content

- 22 Tier 1 minions (Beast, Murloc, Mech, Demon, Dragon, Undead,
  Elemental, Pirate, Naga, Quilboar)
- 5 tokens (Microbot, Skeleton, Cubling, Crab, Whelp)
- 2 Tier 1 spells (A New Sprout, Enchanted Lasso)
- Tiers 2–6 minion arrays exist but are empty (to be filled later)

## 3. Card Pool

### The problem

Hearthstone Battlegrounds uses a shared pool: all players draw from
the same finite set of cards. Buying removes copies, selling returns
them. This is the hardest system to get right because leaks or
double-counts silently break game balance.

### The solution

A `CardPool` class that manages copy counts per definition ID.

### Initialization

On construction, the pool iterates through all non-token minion
definitions and sets each to `POOL_COPIES_PER_TIER[tier]` copies:

| Tier | Copies per minion |
| ---- | ----------------- |
| 1    | 18                |
| 2    | 15                |
| 3    | 13                |
| 4    | 11                |
| 5    | 9                 |
| 6    | 6                 |

### Shop generation

`drawForShop(maxTier, count, rng)` uses **weighted random selection**:

1. Build a list of eligible cards (tier <= maxTier, copies > 0)
2. Sum total available copies as weights
3. Pick a random number in [0, totalWeight)
4. Walk the list, subtracting each card's weight until the random
   value is consumed — that card is drawn
5. Decrement the drawn card's count
6. Repeat for `count` draws

This means rarer cards (fewer copies remaining) are drawn less often,
which matches the real game's probability distribution.

### Shop size per tier

| Tier | Minions offered |
| ---- | --------------- |
| 1    | 3               |
| 2    | 4               |
| 3    | 4               |
| 4    | 5               |
| 5    | 5               |
| 6    | 6               |

### Return and remove

- `returnCard(id)` — Increments count (capped at tier max). Used on
  sell, death, and shop refresh.
- `removeCard(id)` — Decrements count. Returns false if already at 0.

### Decisions

- **Weighted selection over rejection sampling**: Rejection sampling
  (draw random, retry if unavailable) becomes slow when the pool is
  depleted. Weighted selection always terminates in O(n) where n is
  the number of distinct cards.
- **No spell pool**: Spells are not part of the shared pool.
  They are generated separately.
- **Tokens excluded**: Token minions (`isToken: true`) are never
  added to the pool — they are created on demand by effects.

## 4. GameState & phases

(To come)

## Related

- Previous: 002 - Game types & runtime models
- Next: 004 - (TBD)
