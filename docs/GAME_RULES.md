# Game Rules Specification (Battlegrounds-like)

---

# 1. Game Flow

```
INIT
  -> HERO_SELECTION
  -> LOOP
      -> RECRUIT_PHASE
      -> COMBAT_PHASE
  -> END (1 player remaining)
```

---

# 2. Hero Selection Phase

- Each player is offered **4 heroes**
- Duration: **30 seconds**
- Timer becomes visible at **20 seconds remaining**
- If no selection: **first hero is auto-selected**

Each hero has:

- Base HP (~30)
- Optional starting armor
- Unique power

---

# 3. Game Loop

Repeat until only one player is alive.

---

# 4. Recruit Phase

## Gold

- Starts at **3 gold**
- Increases by **+1 per turn**
- Max = **10 gold**
- Unspent gold is lost each turn

Formula:

```
gold = min(3 + turn - 1, 10)
```

---

## Tavern (Shop)

### Pool Access

A player can see cards from:

- Their current tavern tier
- All lower tiers

---

### Shop Size

| Tavern | Cards               |
| ------ | ------------------- |
| 1      | 3 minions + 1 spell |
| 2-3    | 4 minions + 1 spell |
| 4-5    | 5 minions + 1 spell |
| 6      | 6 minions + 1 spell |

---

## Available Actions

- Buy minion (3 gold)
- Buy spell (variable cost)
- Refresh (1 gold)
- Freeze (0 gold)
- Upgrade tavern
- Play card (hand -> board)
- Reorder board

---

## Freeze

- Keeps current shop for next turn
- Cards are NOT returned to the pool

---

## Refresh

- Current shop cards return to pool
- New shop is generated

---

# 5. Global Card Pool

## Copies per Tier

| Tier | Copies |
| ---- | ------ |
| 1    | 18     |
| 2    | 15     |
| 3    | 13     |
| 4    | 11     |
| 5    | 9      |
| 6    | 6      |

---

## Card Lifecycle

```
POOL -> SHOP -> HAND -> BOARD -> (SELL or PLAYER_DEAD) -> POOL
```

---

## Return to Pool ONLY if:

- Card is sold
- Player dies

---

## NOT returned if:

- Bought (in hand or on board)
- In shop (frozen)
- Used in triple (fusion)

---

# 6. Player Death

## Economy

All cards return to pool:

- **Hand**
- **Board**
- **(Optional) Shop**

---

## Ghost System

- Player's last board is saved as a **snapshot**
- Used for combat if odd number of players

Ghost rules:

- Does NOT consume pool (it's a copy)
- Does NOT evolve
- Is immutable

---

# 7. Triple (Fusion)

- 3 identical minions -> 1 golden
- Golden card goes to hand and can be played on the board
- Better stats
- Grants a **discover**

The 3 consumed copies remain removed from pool.

---

# 8. Discover

- Player chooses 1 card among 3
- Cards come from tavern tier +1 (or defined rule)

---

# 9. Tavern Upgrade

## Costs

| Level | Cost |
| ----- | ---- |
| 2     | 5    |
| 3     | 7    |
| 4     | 8    |
| 5     | 11   |
| 6     | 10   |

---

## Reduction

- Cost decreases by **1 each turn**
- Minimum = 0

---

# 10. Combat Phase

## Matchmaking

- Random opponent
- Cannot face same opponent twice in a row (unless only one remains)
- If odd players: fight a ghost (recently dead player)

---

## Combat Rules

- Attack order: left -> right, alternating between players
- Target: random enemy minion
- Automatic resolution, step by step

### Minion Combat

When a minion attacks another:

- Both minions deal their attack value as damage to each other simultaneously
- `defender.currentHp -= attacker.attack`
- `attacker.currentHp -= defender.attack`
- If a minion's currentHp <= 0, it dies and is removed from the board
- Damage persists within the combat (no healing between attacks)
- A weakened minion can be finished off by a later attacker

### Minion Stats

- **baseAttack** / **baseHp**: template values from card definition
- **attackModifier** / **hpModifier**: accumulated buffs/debuffs (persist between turns)
- **currentHp**: effective HP during combat, reset to maxHp (baseHp + hpModifier) at start of each combat
- Effective attack = baseAttack + attackModifier

### Combat Flow

```
1. Determine first attacker (random or player with more minions)
2. Current attacker's leftmost minion that hasn't attacked yet attacks
3. Target: random enemy minion
4. Resolve damage (simultaneous)
5. Remove dead minions
6. Alternate to other player
7. Repeat until one side has no minions or both are empty
```

---

## Damage Calculation

```
damage = tavernLevel + sum(tavern tier of surviving minions)
```

---

## Damage Cap

| Turn | Max Damage |
| ---- | ---------- |
| <= 3 | 5          |
| >= 4 | 10         |
| >= 8 | 15         |

### Special Rule

- If more than 4 players alive: cap = 15
- If 4 or fewer: no cap

---

# 11. Damage & Armor

## Armor Rules

- Armor absorbs damage first
- Then HP is reduced

## Resolution

```
damage -> armor -> hp
```

## Death Condition

```
if hp <= 0 -> player eliminated
```

---

# 12. Armor Cap

- Max armor from effects = **5**
- If armor >= 5: no additional gain

## Special Case

- If hero starts with >5 armor:
  - Keeps value
  - Cannot gain more

---

# 13. RNG Requirement

All randomness must use a controlled RNG:

- Shop generation
- Combat targeting
- Matchmaking

---

# 14. HP Tracking

## HP History

- After each combat phase, record every player's current HP
- Structure: per player, an array indexed by turn number
- Available during the game (leaderboard, HP graph)
- No persistence required — derived from GameState at runtime

## Leaderboard

- Players ranked by current HP at all times
- Displays: hero, HP, tavern tier, last opponent, last damage taken

---

# 15. Game Modes

## Solo (1 human + 7 bots)

- Engine runs client-side (in browser)
- No server required
- Bots play automatically each turn via pluggable strategies

## Duo (2 humans + 6 bots)

- Engine runs server-side (Node.js)
- Server is authoritative: it holds the real GameState
- Players connect via WebSocket
- Each player sends actions (buy, sell, refresh, reorder, end turn)
- Server validates, applies via engine, and broadcasts filtered state
- Each player only sees their own hand, board, shop — never the opponent's shop
- Bots run server-side, same engine, same strategies as solo mode
- Shared data visible to all: leaderboard, HP history, combat results

### State visibility rules

| Data                  | Visible to player                                   |
| --------------------- | --------------------------------------------------- |
| Own hand, board, shop | Yes                                                 |
| Other players' boards | Yes (public info)                                   |
| Other players' hand   | No                                                  |
| Other players' shop   | No                                                  |
| Leaderboard / HP      | Yes                                                 |
| Combat replay events  | Yes (for combats involving the player or spectated) |

---

# 16. End of Game

- Game ends when **1 player remains alive**

---

# Summary

This system includes:

- Full game loop
- Economy (gold + pool)
- Shop mechanics
- Combat system
- Ghost system
- Scaling & balance rules
