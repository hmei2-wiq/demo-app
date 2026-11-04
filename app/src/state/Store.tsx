import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api';
import { addItem, itemCount, mergeLines, removeItem, setQty } from '../lib/cart';
import { addToList, createList, deleteList, removeFromList, reorderLines, setListQty } from '../lib/lists';
import type { Category, Line, Order, Product, ShoppingList } from '../types';

import { loadCart, loadLists, saveCart, saveLists } from '../lib/persistence';

type Store = {
  ready: boolean;
  loadError: string | null;
  reload: () => void;
  categories: Category[];
  products: Map<string, Product>;
  cart: Line[];
  cartCount: number;
  add: (productId: string, qty?: number) => void;
  setQuantity: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clearCart: () => void;
  lists: ShoppingList[];
  newList: (name: string) => void;
  removeList: (listId: string) => void;
  addProductToList: (listId: string, productId: string) => void;
  removeProductFromList: (listId: string, productId: string) => void;
  setListQuantity: (listId: string, productId: string, qty: number) => void;
  addListToCart: (listId: string) => void;
  reorder: (order: Order) => { skipped: number };
};

const Ctx = createContext<Store | null>(null);

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore must be used inside StoreProvider');
  return s;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Line[]>([]);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Map<string, Product>>(new Map());
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const hydrated = useRef(false);
  const [hydratedTick, setHydratedTick] = useState(0);

  // @FR-CART-04 @FR-LST-01 restore from device at launch
  useEffect(() => {
    (async () => {
      const [c, l] = await Promise.all([loadCart(AsyncStorage), loadLists(AsyncStorage)]);
      setCart(c);
      setLists(l);
      hydrated.current = true;
      setHydratedTick(1);
    })();
  }, []);

  // @FR-CART-04 save after every change (only once restored, so we never overwrite with empty)
  useEffect(() => {
    if (hydrated.current) saveCart(AsyncStorage, cart).catch(() => {});
  }, [cart, hydratedTick]);
  useEffect(() => {
    if (hydrated.current) saveLists(AsyncStorage, lists).catch(() => {});
  }, [lists, hydratedTick]);

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const [cats, prods] = await Promise.all([api.categories(), api.products()]);
      setCategories(cats);
      setProducts(new Map(prods.map((p) => [p.id, p])));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Could not load the catalogue');
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const value = useMemo<Store>(
    () => ({
      ready,
      loadError,
      reload: load,
      categories,
      products,
      cart,
      cartCount: itemCount(cart),
      add: (id, qty = 1) => setCart((c) => addItem(c, id, qty)),
      setQuantity: (id, qty) => setCart((c) => setQty(c, id, qty)),
      remove: (id) => setCart((c) => removeItem(c, id)),
      clearCart: () => setCart([]),
      lists,
      newList: (name) => setLists((l) => createList(l, name)),
      removeList: (id) => setLists((l) => deleteList(l, id)),
      addProductToList: (listId, productId) => setLists((l) => addToList(l, listId, productId)),
      removeProductFromList: (listId, productId) => setLists((l) => removeFromList(l, listId, productId)),
      setListQuantity: (listId, productId, qty) => setLists((l) => setListQty(l, listId, productId, qty)),
      addListToCart: (listId) => {
        const list = lists.find((l) => l.id === listId);
        if (list) setCart((c) => mergeLines(c, list.items));
      },
      reorder: (order) => {
        const { lines, skipped } = reorderLines(
          order.lines.map((l) => ({ productId: l.productId, qty: l.qty })),
          new Set(products.keys()),
        );
        setCart((c) => mergeLines(c, lines));
        return { skipped };
      },
    }),
    [ready, loadError, load, categories, products, cart, lists],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
