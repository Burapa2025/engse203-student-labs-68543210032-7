import { describe, test, expect } from 'vitest';
import { summarizeRequests } from './requestSummary.js';

describe('summarizeRequests', () => {
  test('รายการว่าง → ทุกค่าเป็น 0', () => {
    expect(summarizeRequests([])).toEqual({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  });

  // 🏫 regression test W12-DEBUG (CP47 · BUG #2): ใช้ข้อมูลหน้าตาเดียวกับที่ API ส่งมา
  //   (DevTools → Network → GET /api/requests → status เป็น "in-progress" มียัติภังค์)

  test('นับตามค่า status จริงจาก API → inProgress = 2', () => {
    const fromApi = [
      { id: 'REQ-001', status: 'pending' },
      { id: 'REQ-002', status: 'in-progress' },
      { id: 'REQ-003', status: 'in-progress' },
      { id: 'REQ-004', status: 'completed' },
    ];
    expect(summarizeRequests(fromApi)).toEqual({
      total: 4, pending: 1, inProgress: 2, completed: 1,
    });
  });

  test('ทุกรายการเป็น in-progress → inProgress = จำนวนทั้งหมด', () => {
    const fromApi = [
      { id: 'REQ-001', status: 'in-progress' },
      { id: 'REQ-002', status: 'in-progress' },
    ];
    expect(summarizeRequests(fromApi).inProgress).toBe(2);
  });
});
