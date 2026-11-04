export type Product = {
  id: string;
  name: string;
  size: string;
  category: string;
  priceCents: number;
  wasCents?: number;
};

export type Category = { id: string; name: string };

export type Line = { productId: string; qty: number };

export type ShoppingList = { id: string; name: string; items: Line[] };

export type FulfilmentType = 'pickup' | 'delivery';

export type Slot = {
  id: string;
  type: FulfilmentType;
  date: string;
  startHour: number;
  endHour: number;
  label: string;
};

export type QuoteLine = {
  productId: string;
  name: string;
  size: string;
  qty: number;
  unitCents: number;
  lineCents: number;
  savingsCents: number;
};

export type Quote = {
  lines: QuoteLine[];
  subtotalCents: number;
  savingsCents: number;
  deliveryFeeCents: number;
  totalCents: number;
};

export type Order = Quote & {
  id: string;
  createdAt: string;
  fulfilment: { type: FulfilmentType; slot: Slot };
};
