import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server.mjs';

let server;
let base;
const NOW = new Date(2026, 10, 4, 15, 0, 0); // 4 Nov 2026 15:00 local

before(async () => {
  server = createServer({ now: () => NOW });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((r) => server.close(r)));

const get = async (p) => {
  const res = await fetch(base + p);
  return { status: res.status, body: await res.json() };
};
const post = async (p, body, raw) => {
  const res = await fetch(base + p, { method: 'POST', headers: { 'content-type': 'application/json' }, body: raw ?? JSON.stringify(body) });
  return { status: res.status, body: await res.json() };
};

// ---- catalog ----
test('@FR-CAT-01 › Filter by category', async () => {
  const { status, body } = await get('/api/products?category=dairy');
  assert.equal(status, 200);
  assert.ok(body.products.length > 0);
  assert.ok(body.products.every((p) => p.category === 'dairy'));
});

test('@FR-CAT-01 › Unknown category', async () => {
  const { status, body } = await get('/api/products?category=nope');
  assert.equal(status, 200);
  assert.deepEqual(body.products, []);
});

test('@FR-CAT-02 › Case-insensitive match', async () => {
  const { status, body } = await get('/api/products?q=MILK');
  assert.equal(status, 200);
  assert.ok(body.products.length >= 2);
  assert.ok(body.products.every((p) => p.name.toLowerCase().includes('milk')));
});

test('@FR-CAT-02 › Too-short query', async () => {
  const { status, body } = await get('/api/products?q=m');
  assert.equal(status, 400);
  assert.equal(body.code, 'QUERY_TOO_SHORT');
});

test('@FR-CAT-03 › Specials filter', async () => {
  const { status, body } = await get('/api/products?special=1');
  assert.equal(status, 200);
  assert.ok(body.products.length >= 1);
  assert.ok(body.products.every((p) => p.wasCents > p.priceCents));
});

test('@FR-CAT-04 › Known id', async () => {
  const { status, body } = await get('/api/products/p-milk');
  assert.equal(status, 200);
  for (const k of ['id', 'name', 'size', 'category', 'priceCents']) assert.ok(k in body.product, k);
});

test('@FR-CAT-04 › Unknown id', async () => {
  const { status, body } = await get('/api/products/zzz');
  assert.equal(status, 404);
  assert.equal(body.code, 'PRODUCT_NOT_FOUND');
});

// ---- cart / pricing ----
test('@FR-CART-02 › Subtotal and savings', async () => {
  const { status, body } = await post('/api/quote', { items: [{ productId: 'p-apple', qty: 2 }], fulfilment: { type: 'pickup' } });
  assert.equal(status, 200);
  assert.equal(body.subtotalCents, 699 * 2);
  assert.equal(body.savingsCents, (799 - 699) * 2);
  assert.equal(body.totalCents, 699 * 2);
  assert.equal(body.lines[0].lineCents, 1398);
});

test('@FR-CART-03 › Quantity too high', async () => {
  const { status, body } = await post('/api/quote', { items: [{ productId: 'p-milk', qty: 21 }] });
  assert.equal(status, 400);
  assert.equal(body.code, 'INVALID_QUANTITY');
});

test('@FR-CART-03 › Duplicates are merged before the limit', async () => {
  const { status, body } = await post('/api/quote', { items: [{ productId: 'p-milk', qty: 12 }, { productId: 'p-milk', qty: 12 }] });
  assert.equal(status, 400);
  assert.equal(body.code, 'INVALID_QUANTITY');
});

test('@FR-CART-03 › Unknown product', async () => {
  const { status, body } = await post('/api/quote', { items: [{ productId: 'nope', qty: 1 }] });
  assert.equal(status, 400);
  assert.equal(body.code, 'UNKNOWN_PRODUCT');
});

// ---- checkout ----
test('@FR-CHK-01 › Lead time respected', async () => {
  const { status, body } = await get('/api/slots?type=pickup');
  assert.equal(status, 200);
  const today = body.slots.filter((s) => s.date === '2026-11-04');
  assert.ok(today.length > 0);
  assert.ok(today.every((s) => s.startHour >= 17));
  assert.ok(body.slots.every((s) => s.endHour - s.startHour === 2));
  assert.ok(new Set(body.slots.map((s) => s.date)).size <= 3);
});

test('@FR-CHK-01 › Invalid type', async () => {
  const { status, body } = await get('/api/slots?type=teleport');
  assert.equal(status, 400);
  assert.equal(body.code, 'INVALID_FULFILMENT');
});

// p-oil (1100) x9 = 9900; + p-pasta 99? use exact amounts below
test('@FR-CHK-02 › Under threshold', async () => {
  // 9 x 1100 = 9900; + 1 x p-pasta 180 would be 10080, so build 9999 is impossible: use 9900 (< 10000)
  const { body } = await post('/api/quote', { items: [{ productId: 'p-oil', qty: 9 }], fulfilment: { type: 'delivery' } });
  assert.equal(body.subtotalCents, 9900);
  assert.equal(body.deliveryFeeCents, 800);
  assert.equal(body.totalCents, 10700);
});

test('@FR-CHK-02 › At threshold', async () => {
  // 10 x p-water (1000) = 10000 exactly
  const { body } = await post('/api/quote', { items: [{ productId: 'p-water', qty: 10 }], fulfilment: { type: 'delivery' } });
  assert.equal(body.subtotalCents, 10000);
  assert.equal(body.deliveryFeeCents, 0);
});

test('@FR-CHK-02 › Pickup', async () => {
  const { body } = await post('/api/quote', { items: [{ productId: 'p-pasta', qty: 1 }], fulfilment: { type: 'pickup' } });
  assert.equal(body.deliveryFeeCents, 0);
});

test('@FR-CHK-03 › Successful order', async () => {
  const slots = (await get('/api/slots?type=delivery')).body.slots;
  const { status, body } = await post('/api/orders', { items: [{ productId: 'p-milk', qty: 2 }], fulfilment: { type: 'delivery', slotId: slots[0].id } });
  assert.equal(status, 201);
  assert.match(body.order.id, /^FC-[0-9A-F]{8}$/);
  assert.equal(body.order.fulfilment.slot.id, slots[0].id);
  assert.equal(body.order.totalCents, 660 + 800);
});

test('@FR-CHK-03 › Empty basket', async () => {
  const slots = (await get('/api/slots?type=pickup')).body.slots;
  const { status, body } = await post('/api/orders', { items: [], fulfilment: { type: 'pickup', slotId: slots[0].id } });
  assert.equal(status, 400);
  assert.equal(body.code, 'EMPTY_BASKET');
});

test('@FR-CHK-03 › Slot not available', async () => {
  const { status, body } = await post('/api/orders', { items: [{ productId: 'p-milk', qty: 1 }], fulfilment: { type: 'pickup', slotId: 'pickup-2026-11-04T08' } });
  assert.equal(status, 400);
  assert.equal(body.code, 'INVALID_SLOT');
});

test('@FR-CHK-04 › Newest first', async () => {
  const slots = (await get('/api/slots?type=pickup')).body.slots;
  const make = (id) => post('/api/orders', { items: [{ productId: id, qty: 1 }], fulfilment: { type: 'pickup', slotId: slots[0].id } });
  const a = (await make('p-bread')).body.order;
  const b = (await make('p-rice')).body.order;
  const list = (await get('/api/orders')).body.orders;
  assert.equal(list[0].id, b.id);
  assert.equal(list[1].id, a.id);
});

// ---- desktop web ----
test('@FR-DSK-05 › Preflight', async () => {
  const res = await fetch(base + '/api/orders', {
    method: 'OPTIONS',
    headers: { origin: 'http://localhost:8081', 'access-control-request-method': 'POST' },
  });
  assert.equal(res.status, 204);
  assert.equal(await res.text(), '');
  const methods = res.headers.get('access-control-allow-methods') ?? '';
  for (const m of ['GET', 'POST', 'OPTIONS']) assert.ok(methods.includes(m), m);
  assert.match(res.headers.get('access-control-allow-headers') ?? '', /content-type/i);
});

// ---- quality ----
test('@NFR-SEC-01 › Oversized body', async () => {
  const big = JSON.stringify({ items: [], pad: 'x'.repeat(150 * 1024) });
  const { status, body } = await post('/api/quote', null, big);
  assert.equal(status, 413);
  assert.equal(body.code, 'BODY_TOO_LARGE');
});

test('@NFR-SEC-01 › Malformed JSON', async () => {
  const { status, body } = await post('/api/quote', null, '{not json');
  assert.equal(status, 400);
  assert.equal(body.code, 'INVALID_JSON');
});

test('@NFR-PERF-01 › Local latency', async () => {
  const times = [];
  for (let i = 0; i < 200; i++) {
    const t = performance.now();
    await get('/api/products?q=milk');
    times.push(performance.now() - t);
  }
  times.sort((a, b) => a - b);
  const p95 = times[Math.floor(times.length * 0.95) - 1];
  assert.ok(p95 < 200, `p95 was ${p95.toFixed(1)} ms`);
});
