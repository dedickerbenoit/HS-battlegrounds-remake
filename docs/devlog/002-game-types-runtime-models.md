# 002 - Game Types & Runtime Models

## Context

With the game rules defined, the next step is to translate them into a robust type system.

The goal is to create a clear separation between:

- Static definitions (cards, heroes, keywords)
- Runtime state (what actually happens during a game)

This distinction is critical to avoid mixing immutable data with mutable game state.

## Why it matters

In a system like an auto-battler, most bugs come from unclear boundaries between:

- What a card _is_
- What a card _does during a game_

Without strict modeling:

- Effects can leak between instances
- State mutations become unpredictable
- Debugging becomes extremely difficult

A strong type system acts as a safety net for the entire engine.

## Key decisions made

### Static vs Runtime separation

The engine distinguishes between:

- **Definitions** (pure data, immutable)
  - `MinionDefinition`, `SpellDefinition` — card templates
  - `HeroDefinition`, `HeroPowerDefinition` — hero templates
  - `Enchantment` — buff/debuff descriptors
- **Instances** (runtime state, mutable)
  - `MinionInstance` — board/hand minion with modifiers
  - `SpellInstance` — spell in hand/shop
  - `HeroInstance` — hero with current HP/armor

This prevents accidental mutation of base definitions.

### Player vs Hero responsibility

`HeroInstance` owns health-related state:

- HP / Armor
- `takeDamage()` / `isDead()`

`PlayerState` owns game progression and economy:

- Gold
- Tavern tier
- Hand / Board / Shop
- Status (alive/dead)

HP is accessed via `player.hero.currentHp`, not duplicated on PlayerState.

This avoids spreading player logic across multiple structures.

### Event-driven foundation

Core game actions are modeled as events:

- Buy card
- Play card
- Refresh shop
- Combat start / end

The engine will process these events instead of mutating state directly.

This enables:

- Replay systems
- Debugging timelines
- UI decoupling (event consumption)

### String enums

All enums use string values (`Beast = 'Beast'`) instead of numeric auto-increment.

- Readable in logs and JSON serialization
- No silent breakage when reordering members
- Easier debugging across the stack

### Discriminated EventContext

`EventContext` is a union of two distinct interfaces:

- `CombatEventContext` — `friendlyBoard`, `enemyBoard`, source/target are minions
- `RecruitEventContext` — `board`, `hand`, source can be a minion or spell

A single generic context would force optional fields everywhere. The union makes each phase's data explicit and type-safe.

### Set over Array for keywords

`MinionInstance.keywords` uses `Set<Keyword>` instead of `Keyword[]`.

- A minion can't have Taunt twice — `Set` enforces uniqueness structurally
- `has()` / `add()` / `delete()` map directly to game mechanics

### Multi-tribe support

`MinionDefinition.minionType` is a `MinionType[]`, not a single value.

Some minions belong to multiple tribes (e.g. Beast/Mech). An array handles this naturally.

### Strong typing over flexibility

The system favors explicit types over generic structures.

- `MinionInstance` ≠ generic "Card"
- `SpellInstance` has its own model

This reduces ambiguity and makes the engine easier to reason about.

## Trade-offs

- More boilerplate early on
- Slower initial development

But:

- Far fewer bugs later
- Easier refactoring
- Safer feature additions

## What's next

Implement the game loop and combat engine:

- `GameState` with phase management (HERO_SELECTION → RECRUIT → COMBAT)
- Combat resolution (attack order, damage, deathrattles)
- Recruit phase actions (buy, sell, play, freeze, reroll)

## Related

- Previous: 001 - Game rules specification
- Next: 003 - Game loop & combat engine
