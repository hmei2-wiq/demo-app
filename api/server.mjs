import http from 'node:http';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const MAX_BODY = 100 * 1024;
const MAX_QTY = 20;
const MAX_LINES = 50;
const FREE_DELIVERY_AT = 10000;
const DELIVERY_FEE = 800;
const SLOT_STARTS = [8, 10, 12, 14, 16, 18];
const SLOT_DAYS = 3;
const LEAD_MS = 2 * 60 * 60 * 1000;

class HttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const pad = (n) => String(n).padStart(2, '0');
const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function loadCatalog(file = join(here, 'data', 'products.json')) {
  const data = JSON.parse(readFileSync(file, 'utf8'));
  return { categories: data.categories, products: data.products, byId: new Map(data.products.map((p) => [p.id, p])) };
}

/** @FR-CHK-01 slots: 2-hour windows 08:00-20:00, next 3 days, starting at least 2 h from now. */
export function listSlots(type, now) {
  if (type !== 'pickup' && type !== 'delivery') {
    throw new HttpError(400, 'INVALID_FULFILMENT', 'type must be pickup or delivery');
  }
  const earliest = now.getTime() + LEAD_MS;
  const slots = [];
  for (let day = 0; day < SLOT_DAYS; day++) {
    for (const start of SLOT_STARTS) {
      const s = new Date(now.getFullYear(), now.getMonth(), now.getDate() + day, start, 0, 0, 0);
      if (s.getTime() < earliest) continue;
      const date = dayKey(s);
      slots.push({
        id: `${type}-${date}T${pad(start)}`,
        type,
        date,
        startHour: start,
        endHour: start + 2,
        label: `${date} ${pad(start)}:00-${pad(start + 2)}:00`,
      });
    }
  }
  return slots;
}

/** @FR-CART-02 @FR-CART-03 @FR-CHK-02 pricing in integer cents. */
export function priceBasket(catalog, rawItems, type) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new HttpError(400, 'EMPTY_BASKET', 'basket must contain at least one item');
  }
  if (rawItems.length > MAX_LINES) {
    throw new HttpError(400, 'TOO_MANY_LINES', `basket can have at most ${MAX_LINES} lines`);
  }
  const merged = new Map();
  for (const item of rawItems) {
    if (!item || typeof item.productId !== 'string') {
      throw new HttpError(400, 'UNKNOWN_PRODUCT', 'each item needs a productId');
    }
    if (!catalog.byId.has(item.productId)) {
      throw new HttpError(400, 'UNKNOWN_PRODUCT', `unknown product ${item.productId}`);
    }
    if (!Number.isInteger(item.qty)) {
      throw new HttpError(400, 'INVALID_QUANTITY', 'qty must be an integer');
    }
    merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.qty);
  }
  const lines = [];
  let subtotalCents = 0;
  let savingsCents = 0;
  for (const [productId, qty] of merged) {
    if (qty < 1 || qty > MAX_QTY) {
      throw new HttpError(400, 'INVALID_QUANTITY', `qty must be 1 to ${MAX_QTY}`);
    }
    const p = catalog.byId.get(productId);
    const lineCents = p.priceCents * qty;
    const lineSavings = p.wasCents && p.wasCents > p.priceCents ? (p.wasCents - p.priceCents) * qty : 0;
    subtotalCents += lineCents;
    savingsCents += lineSavings;
    lines.push({ productId, name: p.name, size: p.size, qty, unitCents: p.priceCents, lineCents, savingsCents: lineSavings });
  }
  const deliveryFeeCents = type === 'delivery' && subtotalCents < FREE_DELIVERY_AT ? DELIVERY_FEE : 0;
  return { lines, subtotalCents, savingsCents, deliveryFeeCents, totalCents: subtotalCents + deliveryFeeCents };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let tooBig = false;
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        tooBig = true;
        return; // keep draining so the client can read the response
      }
      chunks.push(c);
    });
    req.on('end', () => {
      if (tooBig) return reject(new HttpError(413, 'BODY_TOO_LARGE', 'request body over 100 KB'));
      const text = Buffer.concat(chunks).toString('utf8');
      if (text.length === 0) return resolve({});
      try {
        resolve(JSON.parse(text));
      } catch {
        reject(new HttpError(400, 'INVALID_JSON', 'body is not valid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function send(res, status, body) {
  const text = JSON.stringify(body);
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
  });
  res.end(text);
}

export function createServer({ now = () => new Date(), catalog = loadCatalog() } = {}) {
  const orders = [];

  async function handle(req, res) {
    const url = new URL(req.url, 'http://localhost');
    const path = url.pathname;
    const method = req.method;

    if (method === 'OPTIONS') return send(res, 204, {});

    if (method === 'GET' && path === '/api/health') return send(res, 200, { ok: true });

    if (method === 'GET' && path === '/api/categories') return send(res, 200, { categories: catalog.categories });

    if (method === 'GET' && path === '/api/products') {
      const category = url.searchParams.get('category');
      const q = url.searchParams.get('q');
      const special = url.searchParams.get('special');
      let list = catalog.products;
      if (q !== null) {
        const needle = q.trim().toLowerCase();
        if (needle.length < 2) throw new HttpError(400, 'QUERY_TOO_SHORT', 'search needs at least 2 characters');
        list = list.filter((p) => p.name.toLowerCase().includes(needle));
      }
      if (category) list = list.filter((p) => p.category === category);
      if (special === '1') list = list.filter((p) => p.wasCents && p.wasCents > p.priceCents);
      return send(res, 200, { products: list });
    }

    const detail = path.match(/^\/api\/products\/([^/]+)$/);
    if (method === 'GET' && detail) {
      const p = catalog.byId.get(decodeURIComponent(detail[1]));
      if (!p) throw new HttpError(404, 'PRODUCT_NOT_FOUND', 'product not found');
      return send(res, 200, { product: p });
    }

    if (method === 'GET' && path === '/api/slots') {
      return send(res, 200, { slots: listSlots(url.searchParams.get('type'), now()) });
    }

    if (method === 'POST' && path === '/api/quote') {
      const body = await readBody(req);
      const type = body.fulfilment?.type ?? 'pickup';
      return send(res, 200, priceBasket(catalog, body.items, type));
    }

    if (method === 'POST' && path === '/api/orders') {
      const body = await readBody(req);
      const type = body.fulfilment?.type;
      if (type !== 'pickup' && type !== 'delivery') {
        throw new HttpError(400, 'INVALID_FULFILMENT', 'fulfilment.type must be pickup or delivery');
      }
      const priced = priceBasket(catalog, body.items, type);
      const slot = listSlots(type, now()).find((s) => s.id === body.fulfilment?.slotId);
      if (!slot) throw new HttpError(400, 'INVALID_SLOT', 'slot is not available');
      const order = { id: `FC-${randomUUID().slice(0, 8).toUpperCase()}`, createdAt: now().toISOString(), fulfilment: { type, slot }, ...priced };
      orders.push(order);
      return send(res, 201, { order });
    }

    if (method === 'GET' && path === '/api/orders') {
      return send(res, 200, { orders: [...orders].reverse() });
    }

    throw new HttpError(404, 'NOT_FOUND', 'no such route');
  }

  return http.createServer((req, res) => {
    handle(req, res).catch((err) => {
      if (err instanceof HttpError) return send(res, err.status, { error: err.message, code: err.code });
      console.error(err);
      send(res, 500, { error: 'internal error', code: 'INTERNAL' });
    });
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 3000);
  createServer().listen(port, () => console.log(`FreshCart API on http://localhost:${port}`));
}
