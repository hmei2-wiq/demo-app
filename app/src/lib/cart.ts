import type { Line } from '../types';

export const MAX_QTY = 20;

const clamp = (qty: number) => Math.max(0, Math.min(MAX_QTY, Math.trunc(qty)));

/** @FR-CART-01 add a product, merging with an existing line. */
export function addItem(lines: Line[], productId: string, qty = 1): Line[] {
  const existing = lines.find((l) => l.productId === productId);
  if (!existing) {
    const q = clamp(qty);
    return q > 0 ? [...lines, { productId, qty: q }] : lines;
  }
  return setQty(lines, productId, existing.qty + qty);
}

/** @FR-CART-01 set an exact quantity; zero or less removes the line. */
export function setQty(lines: Line[], productId: string, qty: number): Line[] {
  const q = clamp(qty);
  if (q === 0) return lines.filter((l) => l.productId !== productId);
  return lines.map((l) => (l.productId === productId ? { ...l, qty: q } : l));
}

export function removeItem(lines: Line[], productId: string): Line[] {
  return lines.filter((l) => l.productId !== productId);
}

/** Merge several lines into a cart, summing quantities of products already present. */
export function mergeLines(lines: Line[], additions: Line[]): Line[] {
  return additions.reduce((acc, l) => addItem(acc, l.productId, l.qty), lines);
}

export function itemCount(lines: Line[]): number {
  return lines.reduce((n, l) => n + l.qty, 0);
}
