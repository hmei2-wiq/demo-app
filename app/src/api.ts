import { API_URL } from './config';
import type { Category, FulfilmentType, Line, Order, Product, Quote, Slot } from './types';

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(API_URL + path, init);
  } catch {
    throw new ApiError(0, 'OFFLINE', 'Cannot reach the server. Check your connection and try again.');
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, body.code ?? 'ERROR', body.error ?? 'Something went wrong');
  return body as T;
}

const json = (body: unknown): RequestInit => ({
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

export const api = {
  categories: () => request<{ categories: Category[] }>('/api/categories').then((r) => r.categories),
  products: (p: { category?: string; q?: string; special?: boolean } = {}) => {
    const qs = new URLSearchParams();
    if (p.category) qs.set('category', p.category);
    if (p.q) qs.set('q', p.q);
    if (p.special) qs.set('special', '1');
    const s = qs.toString();
    return request<{ products: Product[] }>(`/api/products${s ? `?${s}` : ''}`).then((r) => r.products);
  },
  product: (id: string) => request<{ product: Product }>(`/api/products/${encodeURIComponent(id)}`).then((r) => r.product),
  slots: (type: FulfilmentType) => request<{ slots: Slot[] }>(`/api/slots?type=${type}`).then((r) => r.slots),
  quote: (items: Line[], type: FulfilmentType) => request<Quote>('/api/quote', json({ items, fulfilment: { type } })),
  placeOrder: (items: Line[], type: FulfilmentType, slotId: string) =>
    request<{ order: Order }>('/api/orders', json({ items, fulfilment: { type, slotId } })).then((r) => r.order),
  orders: () => request<{ orders: Order[] }>('/api/orders').then((r) => r.orders),
};
