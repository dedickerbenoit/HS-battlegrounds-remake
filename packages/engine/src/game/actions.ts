export enum ActionType {
  BuyMinion = 'BuyMinion',
  BuySpell = 'BuySpell',
  SellMinion = 'SellMinion',
  PlayCard = 'PlayCard',
  RefreshShop = 'RefreshShop',
  FreezeShop = 'FreezeShop',
  UpgradeTavern = 'UpgradeTavern',
  ReorderBoard = 'ReorderBoard',
  EndTurn = 'EndTurn',
  SelectHero = 'SelectHero',
}

interface BaseAction {
  playerId: string;
}

export interface BuyMinionAction extends BaseAction {
  type: ActionType.BuyMinion;
  shopIndex: number;
}

export interface BuySpellAction extends BaseAction {
  type: ActionType.BuySpell;
  shopIndex: number;
}

export interface SellMinionAction extends BaseAction {
  type: ActionType.SellMinion;
  boardIndex: number;
}

export interface PlayCardAction extends BaseAction {
  type: ActionType.PlayCard;
  handIndex: number;
  boardPosition?: number;
  targetIndex?: number;
}

export interface RefreshShopAction extends BaseAction {
  type: ActionType.RefreshShop;
}

export interface FreezeShopAction extends BaseAction {
  type: ActionType.FreezeShop;
}

export interface UpgradeTavernAction extends BaseAction {
  type: ActionType.UpgradeTavern;
}

export interface ReorderBoardAction extends BaseAction {
  type: ActionType.ReorderBoard;
  newOrder: number[];
}

export interface EndTurnAction extends BaseAction {
  type: ActionType.EndTurn;
}

export interface SelectHeroAction extends BaseAction {
  type: ActionType.SelectHero;
  heroIndex: number;
}

export type GameAction =
  | BuyMinionAction
  | BuySpellAction
  | SellMinionAction
  | PlayCardAction
  | RefreshShopAction
  | FreezeShopAction
  | UpgradeTavernAction
  | ReorderBoardAction
  | EndTurnAction
  | SelectHeroAction;

export interface ActionResult {
  success: boolean;
  error?: string;
}

export interface GamePlayerSetup {
  id: string;
  name: string;
  isBot?: boolean;
}
