import type { GameState } from './GameState.js';
import { GamePhase } from '../types/enums.js';
import type {
  ActionResult,
  BuyMinionAction,
  BuySpellAction,
  FreezeShopAction,
  PlayCardAction,
  RefreshShopAction,
  ReorderBoardAction,
  SelectHeroAction,
  SellMinionAction,
  UpgradeTavernAction,
} from './actions.js';
import {
  BUY_MINION_COST,
  currentUpgradeCost,
  MAX_BOARD_SIZE,
  MAX_HAND_SIZE,
  REFRESH_COST,
  SELL_MINION_REFUND,
  TAVERN_UPGRADE_COST,
} from './constants.js';
import { GameEventType } from '../types/events.js';
import { SpellInstance } from '../models/SpellInstance.js';
import { MinionInstance } from '../models/MinionInstance.js';

function fail(error: string): ActionResult {
  return { success: false, error };
}

const OK: ActionResult = { success: true };

function requirePhase(game: GameState, phase: GamePhase, playerId: string) {
  if (game.phase !== phase) {
    return fail(`Action not allowed in phase ${game.phase}`);
  }
  if (!game.players.has(playerId)) {
    return fail('Unknown player');
  }
  return null;
}

export function handleSelectHero(game: GameState, action: SelectHeroAction): ActionResult {
  const guard = requirePhase(game, GamePhase.HeroSelection, action.playerId);
  if (guard) return guard;

  if (game.heroSelected.has(action.playerId)) {
    return fail('Hero already selected');
  }

  const choices = game.heroChoices.get(action.playerId);
  if (!choices || action.heroIndex < 0 || action.heroIndex >= choices.length) {
    return fail('Invalid hero index');
  }

  const player = game.getPlayer(action.playerId);
  player.setHero(choices[action.heroIndex]!);
  game.heroSelected.add(action.playerId);

  if (game.heroSelected.size === game.players.size) {
    game.startRecruitPhase();
  }

  return OK;
}

export function handleBuyMinion(game: GameState, action: BuyMinionAction): ActionResult {
  const guard = requirePhase(game, GamePhase.Recruit, action.playerId);
  if (guard) return guard;

  const player = game.getPlayer(action.playerId);

  if (player.gold < BUY_MINION_COST) {
    return fail('Not enough gold');
  }

  if (action.shopIndex < 0 || action.shopIndex >= player.shopMinions.length) {
    return fail('Invalid shop index');
  }

  if (player.hand.length >= MAX_HAND_SIZE) {
    return fail('Hand is full');
  }

  const minion = player.shopMinions.splice(action.shopIndex, 1)[0]!;
  player.gold -= BUY_MINION_COST;
  player.hand.push(minion);

  game.eventBus.emit({
    eventType: GameEventType.OnBuy,
    phase: 'recruit',
    source: minion,
    board: player.board,
    hand: player.hand,
  });

  return OK;
}

export function handleBuySpell(game: GameState, action: BuySpellAction): ActionResult {
  const guard = requirePhase(game, GamePhase.Recruit, action.playerId);
  if (guard) return guard;

  const player = game.getPlayer(action.playerId);

  if (action.shopIndex < 0 || action.shopIndex >= player.shopSpells.length) {
    return fail('Invalid shop index');
  }

  const spell = player.shopSpells[action.shopIndex]!;

  if (player.gold < spell.definition.cost) {
    return fail('Not enough gold');
  }

  if (player.hand.length >= MAX_HAND_SIZE) {
    return fail('Hand is full');
  }

  player.shopSpells.splice(action.shopIndex, 1);
  player.gold -= spell.definition.cost;
  player.hand.push(spell);

  return OK;
}

export function handleSellMinion(game: GameState, action: SellMinionAction): ActionResult {
  const guard = requirePhase(game, GamePhase.Recruit, action.playerId);
  if (guard) return guard;

  const player = game.getPlayer(action.playerId);

  if (action.boardIndex < 0 || action.boardIndex >= player.board.length) {
    return fail('Invalid board index');
  }

  const minion = player.board.splice(action.boardIndex, 1)[0]!;
  player.gold += SELL_MINION_REFUND;

  game.cardPool.returnCard(minion.definition.id);

  game.eventBus.emit({
    eventType: GameEventType.OnSell,
    phase: 'recruit',
    source: minion,
    board: player.board,
    hand: player.hand,
  });

  return OK;
}

export function handlePlayCard(game: GameState, action: PlayCardAction): ActionResult {
  const guard = requirePhase(game, GamePhase.Recruit, action.playerId);
  if (guard) return guard;

  const player = game.getPlayer(action.playerId);

  if (action.handIndex < 0 || action.handIndex >= player.hand.length) {
    return fail('Invalid hand index');
  }

  const card = player.hand[action.handIndex]!;

  if (card instanceof MinionInstance) {
    if (player.board.length >= MAX_BOARD_SIZE) {
      return fail('Board is full');
    }

    player.hand.splice(action.handIndex, 1);
    const position = action.boardPosition ?? player.board.length;
    player.board.splice(position, 0, card);

    game.eventBus.emit({
      eventType: GameEventType.OnSummon,
      phase: 'recruit',
      source: card,
      board: player.board,
      hand: player.hand,
    });
  } else if (card instanceof SpellInstance) {
    player.hand.splice(action.handIndex, 1);
    // temp: Spell effect would be triggered here via eventBus, for now, spells are consumed without effect (TODO)
  }

  return OK;
}

export function handleRefreshShop(game: GameState, action: RefreshShopAction): ActionResult {
  const guard = requirePhase(game, GamePhase.Recruit, action.playerId);
  if (guard) return guard;

  const player = game.getPlayer(action.playerId);

  if (player.gold < REFRESH_COST) {
    return fail('Not enough gold');
  }

  player.gold -= REFRESH_COST;
  game.returnShopToPool(player);
  game.generateShop(player);
  player.frozen = false;

  return OK;
}

export function handleFreezeShop(game: GameState, action: FreezeShopAction): ActionResult {
  const guard = requirePhase(game, GamePhase.Recruit, action.playerId);
  if (guard) return guard;

  const player = game.getPlayer(action.playerId);
  player.frozen = !player.frozen;

  return OK;
}

export function handleUpgradeTavern(game: GameState, action: UpgradeTavernAction): ActionResult {
  const guard = requirePhase(game, GamePhase.Recruit, action.playerId);
  if (guard) return guard;

  const player = game.getPlayer(action.playerId);

  const nextTier = player.tavernTier + 1;
  const baseCost = (TAVERN_UPGRADE_COST as Record<number, number | undefined>)[nextTier];
  if (baseCost == null) {
    return fail('Already at max tavern tier');
  }

  const cost = currentUpgradeCost(baseCost, player.upgradeProgress);

  if (player.gold < cost) {
    return fail('Not enough gold');
  }

  player.gold -= cost;
  player.upgradeTavernTier();

  return OK;
}

export function handleReorderBoard(game: GameState, action: ReorderBoardAction): ActionResult {
  const guard = requirePhase(game, GamePhase.Recruit, action.playerId);
  if (guard) return guard;

  const player = game.getPlayer(action.playerId);
  const { newOrder } = action;

  if (newOrder.length !== player.board.length) {
    return fail('Order length does not match board size');
  }

  const sorted = [...newOrder].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== i) {
      return fail('Invalid order: must be a permutation of indices');
    }
  }

  const reordered = newOrder.map((i) => player.board[i]!);
  player.board = reordered;

  return OK;
}

export function handleEndTurn(game: GameState, action: { playerId: string }): ActionResult {
  const guard = requirePhase(game, GamePhase.Recruit, action.playerId);
  if (guard) return guard;

  if (game.turnReadyPlayers.has(action.playerId)) {
    return fail('Already ended turn');
  }

  game.turnReadyPlayers.add(action.playerId);

  // If all alive players are ready, start combat
  if (game.turnReadyPlayers.size === game.getAlivePlayers().length) {
    game.startCombatPhase();
  }

  return OK;
}
