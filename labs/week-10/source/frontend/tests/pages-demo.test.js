import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createPagesDemoService, PAGES_STORAGE_KEY } from '../src/services/pagesDemoService.js';

const seedRequests = JSON.parse(readFileSync(new URL('../src/data/pagesDemoRequests.json', import.meta.url), 'utf8'));
const input = { requesterName: 'ผู้ทดสอบ', requestType: 'แจ้งซ่อม', location: 'ห้องทดสอบ', details: 'รายละเอียดทดสอบการบันทึกคำร้อง', priority: 'normal' };
function setup() {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const create = (options = {}) => createPagesDemoService({ storage, seedRequests, ...options });
  return { values, storage, create, service: create() };
}

test('initial dashboard has 10 requests with the reference status counts and first three rows', () => {
  const { service } = setup();
  const requests = service.getRequests();
  assert.equal(requests.length, 10);
  assert.deepEqual(['pending', 'in-progress', 'completed'].map((status) => service.getRequests({ status }).length), [5, 3, 2]);
  assert.deepEqual(requests.slice(0, 3).map(({ id, requestType }) => [id, requestType]), [['REQ-001', 'แจ้งซ่อม'], ['REQ-002', 'บริการบัญชีผู้ใช้'], ['REQ-003', 'ขอใช้อุปกรณ์']]);
});

test('create, detail and status change persist across service recreation', () => {
  const { service, create } = setup();
  const created = service.addRequest({ ...input, requesterName: '  ผู้ทดสอบ  ', status: 'completed', id: 'REQ-999' });
  assert.equal(created.id, 'REQ-011');
  assert.equal(created.status, 'pending');
  assert.equal(created.requesterName, 'ผู้ทดสอบ');
  assert.equal(create().getRequestById(created.id).details, input.details);
  service.updateRequestStatus(created.id, 'completed');
  assert.equal(create().getRequestById(created.id).status, 'completed');
});

test('deleting a request persists and never reuses its ID for the next creation', () => {
  const { service, create } = setup();
  const first = service.addRequest(input);
  assert.equal(service.deleteRequest(first.id).length, 10);
  assert.equal(create().getRequestById(first.id), null);
  assert.equal(create().addRequest(input).id, 'REQ-012');
});

test('reset restores only this lab seed and its ID sequence', () => {
  const { service, values } = setup();
  values.set('engse203-week-07-pages-demo-v1', 'other lab');
  service.addRequest(input);
  service.deleteRequest('REQ-001');
  assert.deepEqual(service.resetRequests(), seedRequests);
  assert.equal(values.get('engse203-week-07-pages-demo-v1'), 'other lab');
  assert.equal(service.addRequest(input).id, 'REQ-011');
});

test('invalid creation and status transitions do not change saved requests', () => {
  const { service, values } = setup();
  service.getRequests();
  const before = values.get(PAGES_STORAGE_KEY);
  for (const invalid of [undefined, {}, { ...input, requesterName: 'x' }, { ...input, details: 'short' }, { ...input, requestType: 'unknown' }, { ...input, requestType: 'ขอใช้ห้อง' }, { ...input, priority: 'critical' }, { ...input, location: '' }]) {
    assert.throws(() => service.addRequest(invalid));
  }
  assert.throws(() => service.updateRequestStatus('REQ-001', 'invalid'));
  assert.throws(() => service.updateRequestStatus('REQ-999', 'completed'));
  assert.throws(() => service.deleteRequest('REQ-999'));
  assert.equal(values.get(PAGES_STORAGE_KEY), before);
});

test('damaged stored data, duplicate IDs and old schemas recover with an explanation', () => {
  const { service, values } = setup();
  for (const invalid of ['{broken', JSON.stringify({ schemaVersion: 2, nextSequence: 11, requests: seedRequests }), JSON.stringify({ schemaVersion: 1, nextSequence: 11, requests: [seedRequests[0], seedRequests[0]] })]) {
    values.set(PAGES_STORAGE_KEY, invalid);
    let notice = '';
    assert.deepEqual(service.getRequests({ onRecovery: (message) => { notice = message; } }), seedRequests);
    assert.ok(notice.length > 0);
    assert.doesNotThrow(() => JSON.parse(values.get(PAGES_STORAGE_KEY)));
  }
});

test('caller mutations cannot silently modify stored or seed data', () => {
  const { service } = setup();
  const requests = service.getRequests();
  requests[0].details = 'changed';
  service.getRequestById('REQ-001').status = 'completed';
  assert.deepEqual(service.getRequests(), seedRequests);
});

test('two service instances observe fresh persisted state and keep both changes', () => {
  const { service, create } = setup();
  const second = create();
  second.getRequests();
  assert.equal(service.addRequest(input).id, 'REQ-011');
  assert.equal(second.addRequest(input).id, 'REQ-012');
  assert.equal(service.getRequests().length, 12);
});

test('storage failures produce a clear error and do not pretend a change was saved', () => {
  const { storage, service, create } = setup();
  service.getRequests();
  const failing = create({ storage: { ...storage, setItem() { throw new Error('quota'); } } });
  assert.throws(() => failing.addRequest(input), /บันทึกข้อมูลสาธิตไม่ได้/);
  assert.equal(service.getRequests().length, 10);
  assert.throws(() => create({ storage: { getItem() { throw new Error('blocked'); } } }).getRequests(), /อ่านข้อมูลสาธิตไม่ได้/);
});

test('deleting every request stays empty on reload until explicit reset', () => {
  const { service, create } = setup();
  for (const { id } of service.getRequests()) service.deleteRequest(id);
  assert.deepEqual(create().getRequests(), []);
  assert.equal(create().resetRequests().length, 10);
});
