import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => {
  await loadSeed();
  app = createApp();
});

const validRequest = {
  requesterName: 'ทดสอบ ระบบ',
  requestType: 'แจ้งซ่อม',
  location: 'C3-401',
  details: 'รายละเอียดยาวพอสมควรจริง',
  priority: 'normal',
};

describe('GET /api/requests', () => {
  test('คืนรายการทั้งหมด พร้อม status 200', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });
});

describe('GET /api/requests/:id', () => {
  test('พบคำร้อง จะคืน 200 พร้อมข้อมูล', async () => {
    const res = await request(app).get('/api/requests/REQ-001');
    assert.equal(res.status, 200);
    assert.equal(res.body.id, 'REQ-001');
  });

  test('ไม่พบคำร้อง จะคืน 404', async () => {
    const res = await request(app).get('/api/requests/REQ-0000');
    assert.equal(res.status, 404);
  });
});

describe('POST /api/requests', () => {
  test('ส่งข้อมูลถูกต้อง จะคืน 201 พร้อมข้อมูล', async () => {
    const res = await request(app).post('/api/requests').send(validRequest);
    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'pending');
  });

  test('ข้อมูลไม่ครบ จะคืน 400', async () => {
    const res = await request(app).post('/api/requests').send({});
    assert.equal(res.status, 400);
  });
});

describe('Cors header', () => {
  test('ส่ง origin ที่อนุญาต จะคืน 200', async () => {
    const res = await request(app)
      .get('/api/requests')
      .set('Origin', 'http://localhost:5173');
    assert.equal(res.status, 200);
    assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:5173');
  });
});
