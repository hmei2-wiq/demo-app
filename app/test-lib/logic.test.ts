// Pure-logic tests. Run with: npm run test:lib (Node 22.6+, uses built-in test runner).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addItem, setQty, mergeLines } from '../src/lib/cart.ts';
import { createList, addToList, reorderLines, setListQty } from '../src/lib/lists.ts';
import { loadCart, saveCart, loadLists, saveLists } from '../src/lib/persistence.ts';

const memoryStorage = () => {
  const m = new Map<string, string>();
  return {
    getItem: async (k: string) => m.get(k) ?? null,
    setItem: async (k: string, v: string) => void m.set(k, v),
  };
};

test('@FR-CART-04 › Restore after restart', async () => {
  const storage = memoryStorage();
  const cart = addItem(addItem([], 'p-milk', 2), 'p-bread');
  await saveCart(storage, cart);
  // "restart": a fresh load from the same storage
  assert.deepEqual(await loadCart(storage), cart);
});

test('@FR-CART-04 › Corrupted storage gives an empty cart', async () => {
  const storage = memoryStorage();
  await storage.setItem('freshcart.cart.v1', '{broken');
  assert.deepEqual(await loadCart(storage), []);
  await storage.setItem('freshcart.cart.v1', JSON.stringify([{ productId: 'a', qty: 0 }, { productId: 'b', qty: 2 }]));
  assert.deepEqual(await loadCart(storage), [{ productId: 'b', qty: 2 }]);
});

test('@FR-LST-01 › Lists survive a restart', async () => {
  const storage = memoryStorage();
  const lists = addToList(createList([], 'Weekly'), 'x', 'p-milk');
  const created = createList([], 'Weekly');
  await saveLists(storage, created);
  assert.deepEqual(await loadLists(storage), created);
  assert.equal(lists.length, 1);
});

test('@FR-LST-01 › Decrease and remove in a list', () => {
  let lists = createList([], 'Weekly');
  const id = lists[0].id;
  lists = addToList(lists, id, 'p-milk', 3);
  lists = setListQty(lists, id, 'p-milk', 2);
  assert.equal(lists[0].items[0].qty, 2);
  lists = setListQty(lists, id, 'p-milk', 0);
  assert.deepEqual(lists[0].items, []);
});

test('@FR-CART-01 › Add and increase', () => {
  let cart = addItem([], 'p-milk');
  cart = addItem(cart, 'p-milk');
  assert.deepEqual(cart, [{ productId: 'p-milk', qty: 2 }]);
});

test('@FR-CART-01 › Decrease to zero', () => {
  const cart = setQty([{ productId: 'p-milk', qty: 1 }], 'p-milk', 0);
  assert.deepEqual(cart, []);
});

test('@FR-CART-01 › Quantity never exceeds 20', () => {
  const cart = addItem([{ productId: 'p-milk', qty: 19 }], 'p-milk', 5);
  assert.equal(cart[0].qty, 20);
});

test('@FR-LST-01 › Create and add', () => {
  let lists = createList([], 'Weekly');
  assert.equal(lists.length, 1);
  lists = addToList(lists, lists[0].id, 'p-milk');
  assert.equal(lists[0].name, 'Weekly');
  assert.deepEqual(lists[0].items, [{ productId: 'p-milk', qty: 1 }]);
});

test('@FR-LST-01 › Blank names are ignored', () => {
  assert.deepEqual(createList([], '   '), []);
});

test('@FR-LST-02 › Merge into cart', () => {
  const cart = [{ productId: 'p-milk', qty: 1 }];
  const list = [
    { productId: 'p-milk', qty: 2 },
    { productId: 'p-bread', qty: 1 },
  ];
  assert.deepEqual(mergeLines(cart, list), [
    { productId: 'p-milk', qty: 3 },
    { productId: 'p-bread', qty: 1 },
  ]);
});

test('@FR-LST-03 › Reorder with a discontinued product', () => {
  const available = new Set(['p-milk', 'p-bread']);
  const { lines, skipped } = reorderLines(
    [
      { productId: 'p-milk', qty: 2 },
      { productId: 'p-gone', qty: 1 },
      { productId: 'p-bread', qty: 1 },
    ],
    available,
  );
  assert.equal(skipped, 1);
  assert.equal(lines.length, 2);
});
