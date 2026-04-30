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

(To come)

## 3. Card Pool

(To come)

## 4. GameState & phases

(To come)

## Related

- Previous: 002 - Game types & runtime models
- Next: 004 - (TBD)
