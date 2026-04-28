import type { Effect } from './events.js';

export interface Enchantment {
  id: string;
  name: string;
  attackBuff?: number;
  hpBuff?: number;
  effects?: Effect[];
}
