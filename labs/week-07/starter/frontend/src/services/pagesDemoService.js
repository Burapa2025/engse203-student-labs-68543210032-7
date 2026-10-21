import { ApiError } from './apiClient.js';

export const PAGES_DEMO_STORAGE_KEY = 'engse203-week-07-pages-demo-v1';
const STATUSES = new Set(['pending', 'in-progress', 'completed']);
const REQUEST_TYPES = new Set(['แจ้งซ่อม', 'บริการบัญชีผู้ใช้', 'ขอใช้อุปกรณ์', 'อื่น ๆ']);
const PRIORITIES = new Set(['normal', 'urgent']);
const text = (value) => typeof value === 'string' ? value.trim() : '';

function validateInput(input) {
  if (!input || text(input.requesterName).length < 2
    || !REQUEST_TYPES.has(input.requestType) || !text(input.location)
    || text(input.details).length < 10 || !PRIORITIES.has(input.priority)) {
    throw new ApiError('กรุณาตรวจชื่อผู้แจ้ง ประเภท สถานที่ รายละเอียดอย่างน้อย 10 ตัวอักษร และความเร่งด่วน', 400);
  }
}

function validRequests(requests) {
  if (!Array.isArray(requests)) return false;
  try {
    for (const request of requests) {
      validateInput(request);
      if (!text(request.id).startsWith('REQ-') || !STATUSES.has(request.status)) return false;
    }
    return new Set(requests.map(({ id }) => id)).size === requests.length;
  } catch {
    return false;
  }
}

/** Explicit browser demo for the Pages build; the normal build uses Express. */
export function createPagesDemoService({ storage, loadSeed, storageKey = PAGES_DEMO_STORAGE_KEY }) {
  function write(requests) {
    try {
      storage.setItem(storageKey, JSON.stringify({ schemaVersion: 1, requests }));
    } catch {
      throw new ApiError('บันทึกข้อมูลสาธิตไม่ได้ กรุณาอนุญาต browser storage แล้วลองอีกครั้ง', 0);
    }
    return structuredClone(requests);
  }

  async function resetRequests() {
    const seed = await loadSeed();
    if (!validRequests(seed)) throw new ApiError('ข้อมูลตัวอย่างไม่ถูกต้อง', 500);
    return write(seed);
  }

  async function read(onRecovery) {
    let raw;
    try {
      raw = storage.getItem(storageKey);
    } catch {
      throw new ApiError('อ่านข้อมูลสาธิตไม่ได้ กรุณาอนุญาต browser storage แล้วลองอีกครั้ง', 0);
    }
    if (raw !== null) {
      try {
        const saved = JSON.parse(raw);
        if (saved?.schemaVersion === 1 && validRequests(saved.requests)) {
          return structuredClone(saved.requests);
        }
      } catch { /* Restore the public seed when stored data is damaged. */ }
      onRecovery?.('ข้อมูลสาธิตที่บันทึกไว้ไม่ถูกต้อง จึงคืนข้อมูลตัวอย่างเริ่มต้นแล้ว');
    }
    return resetRequests();
  }

  return {
    async getRequests(options = {}) {
      if (options.scenario === 'error') throw new ApiError('LAB scenario: จำลองการโหลดไม่สำเร็จ', 500);
      if (options.scenario === 'empty') return [];
      const requests = await read(options.onRecovery);
      return options.status ? requests.filter(({ status }) => status === options.status) : requests;
    },
    async getRequestById(requestId) {
      return (await read()).find(({ id }) => id === requestId) ?? null;
    },
    async addRequest(input) {
      validateInput(input);
      const requests = await read();
      let id;
      do {
        id = `REQ-${globalThis.crypto.randomUUID().toUpperCase()}`;
      } while (requests.some((request) => request.id === id));
      const created = {
        id, requesterName: text(input.requesterName), requestType: input.requestType,
        location: text(input.location), details: text(input.details),
        priority: input.priority, status: 'pending',
      };
      write([...requests, created]);
      return structuredClone(created);
    },
    async updateRequestStatus(requestId, status) {
      if (!STATUSES.has(status)) throw new ApiError('สถานะคำร้องไม่ถูกต้อง', 400);
      const requests = await read();
      const found = requests.find(({ id }) => id === requestId);
      if (!found) throw new ApiError('ไม่พบคำร้อง', 404);
      found.status = status;
      write(requests);
      return structuredClone(found);
    },
    async deleteRequest(requestId) {
      const requests = await read();
      if (!requests.some(({ id }) => id === requestId)) throw new ApiError('ไม่พบคำร้อง', 404);
      return write(requests.filter(({ id }) => id !== requestId));
    },
    resetRequests,
  };
}
