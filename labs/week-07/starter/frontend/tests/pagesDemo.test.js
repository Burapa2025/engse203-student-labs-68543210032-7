import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { createPagesDemoService, PAGES_DEMO_STORAGE_KEY } from '../src/services/pagesDemoService.js';

const seed = JSON.parse(await readFile(new URL('../public/data/initialRequests.json', import.meta.url)));
const input = {
  requesterName: '  ผู้ทดสอบ  ', requestType: 'แจ้งซ่อม', location: '  ห้องทดสอบ  ',
  details: '  ทดสอบสร้างคำร้องใหม่สำหรับหน้า Pages  ', priority: 'normal', status: 'completed',
};
function setup(storageKey) {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const create = (key = storageKey) => createPagesDemoService({ storage, loadSeed: async () => structuredClone(seed), storageKey: key });
  return { values, storage, create, service: create() };
}

test('seeds the same three requests as the API and filters status without mutating source', async () => {
  const { service } = setup();
  assert.equal(seed.length, 3);
  assert.deepEqual(await service.getRequests(), seed);
  assert.deepEqual((await service.getRequests({ status: 'pending' })).map(({ id }) => id), ['REQ-001']);
  assert.deepEqual((await service.getRequests({ status: 'in-progress' })).map(({ id }) => id), ['REQ-002']);
  assert.deepEqual((await service.getRequests({ status: 'completed' })).map(({ id }) => id), ['REQ-003']);
  const returned = await service.getRequests();
  returned[0].details = 'changed';
  assert.deepEqual(await service.getRequests(), seed);
});

test('creates, updates and deletes with persistence after service recreation', async () => {
  const { create, service } = setup();
  const first = await service.addRequest(input);
  const second = await service.addRequest(input);
  assert.match(first.id, /^REQ-/);
  assert.notEqual(first.id, second.id);
  assert.equal(first.requesterName, 'ผู้ทดสอบ');
  assert.equal(first.location, 'ห้องทดสอบ');
  assert.equal(first.status, 'pending');
  assert.deepEqual(await create().getRequestById(first.id), first);
  await create().updateRequestStatus(first.id, 'completed');
  assert.equal((await create().getRequestById(first.id)).status, 'completed');
  assert.equal((await create().deleteRequest(first.id)).length, 4);
  assert.equal(await create().getRequestById(first.id), null);
});

test('validates input and status before writing, and reports missing IDs', async () => {
  const { service } = setup();
  await service.getRequests();
  for (const invalid of [null, {}, { ...input, requesterName: 'a' }, { ...input, requestType: 'unknown' },
    { ...input, location: ' ' }, { ...input, details: 'short' }, { ...input, priority: 'critical' }]) {
    await assert.rejects(service.addRequest(invalid), { status: 400 });
  }
  await assert.rejects(service.updateRequestStatus('REQ-001', 'invalid'), { status: 400 });
  await assert.rejects(service.updateRequestStatus('REQ-missing', 'pending'), { status: 404 });
  await assert.rejects(service.deleteRequest('REQ-missing'), { status: 404 });
  assert.deepEqual(await service.getRequests(), seed);
});

test('preserves an empty list across reload and restores seed only on reset', async () => {
  const { service, create } = setup();
  for (const { id } of seed) await service.deleteRequest(id);
  assert.deepEqual(await create().getRequests(), []);
  assert.deepEqual(await create().resetRequests(), seed);
  assert.deepEqual(await create().getRequests(), seed);
});

test('keeps lab07 data isolated and repairs malformed storage with a recovery notice', async () => {
  const { values, service, create } = setup();
  const other = create('engse203-week-10-pages-demo-v1');
  await other.addRequest(input);
  assert.equal((await other.getRequests()).length, 4);
  assert.equal((await service.getRequests()).length, 3);
  values.set(PAGES_DEMO_STORAGE_KEY, '{broken');
  let notice = '';
  assert.deepEqual(await service.getRequests({ onRecovery: (message) => { notice = message; } }), seed);
  assert.ok(notice.includes('คืนข้อมูล'));
  await service.resetRequests();
  assert.equal((await other.getRequests()).length, 4);
});

test('surfaces storage failures and rejects malformed public seed', async () => {
  const broken = createPagesDemoService({ storage: { getItem() { throw new Error(); } }, loadSeed: async () => seed });
  await assert.rejects(broken.getRequests(), { status: 0 });
  const { storage } = setup();
  const invalid = createPagesDemoService({ storage, loadSeed: async () => [{ id: 'bad' }] });
  await assert.rejects(invalid.resetRequests(), { status: 500 });
});

test('retains error and empty UI scenarios without overwriting stored data', async () => {
  const { service } = setup();
  await assert.rejects(service.getRequests({ scenario: 'error' }), { status: 500 });
  assert.deepEqual(await service.getRequests({ scenario: 'empty' }), []);
  assert.deepEqual(await service.getRequests(), seed);
});

test('normal frontend service keeps using Express API instead of browser storage', async (context) => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  context.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return { ok: true, status: 200, json: async () => seed };
  };
  const service = await import('../src/services/requestService.js');
  assert.equal(service.isPagesDemo, false);
  assert.deepEqual(await service.getRequests({ status: 'pending' }), seed);
  assert.equal(calls[0].url, 'http://localhost:3001/api/requests?status=pending');
});
