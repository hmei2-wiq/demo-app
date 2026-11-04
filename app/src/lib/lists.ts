import type { Line, ShoppingList } from '../types';

let counter = 0;
const newId = () => `list-${Date.now().toString(36)}-${(counter++).toString(36)}`;

/** @FR-LST-01 create a named list. */
export function createList(lists: ShoppingList[], name: string): ShoppingList[] {
  const trimmed = name.trim();
  if (!trimmed) return lists;
  return [...lists, { id: newId(), name: trimmed.slice(0, 40), items: [] }];
}

export function deleteList(lists: ShoppingList[], listId: string): ShoppingList[] {
  return lists.filter((l) => l.id !== listId);
}

/** @FR-LST-01 add a product (or increase its quantity) in a list. */
export function addToList(lists: ShoppingList[], listId: string, productId: string, qty = 1): ShoppingList[] {
  return lists.map((l) => {
    if (l.id !== listId) return l;
    const existing = l.items.find((i) => i.productId === productId);
    const items = existing
      ? l.items.map((i) => (i.productId === productId ? { ...i, qty: Math.min(20, i.qty + qty) } : i))
      : [...l.items, { productId, qty: Math.min(20, qty) }];
    return { ...l, items };
  });
}

/** @FR-LST-01 set an exact quantity in a list; zero or less removes the product. */
export function setListQty(lists: ShoppingList[], listId: string, productId: string, qty: number): ShoppingList[] {
  const q = Math.min(20, Math.trunc(qty));
  return lists.map((l) => {
    if (l.id !== listId) return l;
    const items = q < 1 ? l.items.filter((i) => i.productId !== productId) : l.items.map((i) => (i.productId === productId ? { ...i, qty: q } : i));
    return { ...l, items };
  });
}

/** @FR-LST-01 remove a product from a list. */
export function removeFromList(lists: ShoppingList[], listId: string, productId: string): ShoppingList[] {
  return lists.map((l) => (l.id === listId ? { ...l, items: l.items.filter((i) => i.productId !== productId) } : l));
}

/**
 * @FR-LST-03 prepare an order's lines for reordering: drop products that are no
 * longer sold and report how many were skipped.
 */
export function reorderLines(orderLines: Line[], availableIds: Set<string>): { lines: Line[]; skipped: number } {
  const lines = orderLines.filter((l) => availableIds.has(l.productId));
  return { lines, skipped: orderLines.length - lines.length };
}
