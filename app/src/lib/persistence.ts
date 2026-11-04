import type { Line, ShoppingList } from '../types';

export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

export const CART_KEY = 'freshcart.cart.v1';
export const LISTS_KEY = 'freshcart.lists.v1';

const isLine = (x: unknown): x is Line =>
  !!x && typeof (x as Line).productId === 'string' && Number.isInteger((x as Line).qty) && (x as Line).qty > 0;

/** @FR-CART-04 save the cart after every change. */
export const saveCart = (s: KeyValueStorage, lines: Line[]) => s.setItem(CART_KEY, JSON.stringify(lines));

/** @FR-CART-04 restore the cart; corrupted or missing data gives an empty cart. */
export async function loadCart(s: KeyValueStorage): Promise<Line[]> {
  try {
    const raw = await s.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isLine) : [];
  } catch {
    return [];
  }
}

/** @FR-LST-01 */
export const saveLists = (s: KeyValueStorage, lists: ShoppingList[]) => s.setItem(LISTS_KEY, JSON.stringify(lists));

/** @FR-LST-01 */
export async function loadLists(s: KeyValueStorage): Promise<ShoppingList[]> {
  try {
    const raw = await s.getItem(LISTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((l) => l && typeof l.id === 'string' && typeof l.name === 'string' && Array.isArray(l.items))
      : [];
  } catch {
    return [];
  }
}
