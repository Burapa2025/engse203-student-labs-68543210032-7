export const PAGES_STORAGE_KEY = 'engse203-week-10-pages-demo-v1';

const statuses = new Set(['pending', 'in-progress', 'completed']);
const priorities = new Set(['normal', 'urgent']);
const requestTypes = new Set(['แจ้งซ่อม', 'บริการบัญชีผู้ใช้', 'ขอใช้อุปกรณ์', 'อื่น ๆ']);
const clone = (value) => structuredClone(value);

function validateInput(input) {
  if (!input || typeof input !== 'object') throw new Error('กรุณากรอกข้อมูลคำร้อง');
  const normalized = Object.fromEntries(
    ['requesterName', 'requestType', 'location', 'details', 'priority']
      .map((key) => [key, typeof input[key] === 'string' ? input[key].trim() : '']),
  );
  if (normalized.requesterName.length < 2) throw new Error('กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร');
  if (!requestTypes.has(normalized.requestType)) throw new Error('กรุณาเลือกประเภทคำร้อง');
  if (!normalized.location) throw new Error('กรุณาระบุสถานที่');
  if (normalized.details.length < 10) throw new Error('กรุณากรอกรายละเอียดอย่างน้อย 10 ตัวอักษร');
  if (!priorities.has(normalized.priority)) throw new Error('กรุณาเลือกความเร่งด่วน');
  return normalized;
}

function validRequests(requests) {
  if (!Array.isArray(requests)) return false;
  try {
    for (const request of requests) {
      validateInput(request);
      if (!/^REQ-\d{3,}$/.test(request.id) || !statuses.has(request.status)) return false;
    }
    return new Set(requests.map(({ id }) => id)).size === requests.length;
  } catch {
    return false;
  }
}

function nextSequence(requests) {
  return Math.max(0, ...requests.map(({ id }) => Number(id.slice(4)))) + 1;
}

/** Pages-only adapter. Normal builds continue using the Express/SQLite API. */
export function createPagesDemoService({ storage, seedRequests, storageKey = PAGES_STORAGE_KEY }) {
  if (!validRequests(seedRequests)) throw new Error('ข้อมูลตัวอย่างไม่ตรงรูปแบบคำร้อง');
  const initialState = () => ({ schemaVersion: 1, nextSequence: nextSequence(seedRequests), requests: clone(seedRequests) });

  function write(state) {
    try {
      storage.setItem(storageKey, JSON.stringify(state));
    } catch {
      throw new Error('บันทึกข้อมูลสาธิตไม่ได้ กรุณาอนุญาต browser storage หรือคืนพื้นที่จัดเก็บ');
    }
    return clone(state.requests);
  }

  function read(onRecovery) {
    let raw;
    try {
      raw = storage.getItem(storageKey);
    } catch {
      throw new Error('อ่านข้อมูลสาธิตไม่ได้ กรุณาอนุญาต browser storage');
    }
    if (raw !== null) {
      try {
        const state = JSON.parse(raw);
        if (state?.schemaVersion === 1 && validRequests(state.requests)
          && Number.isSafeInteger(state.nextSequence)
          && state.nextSequence >= nextSequence(state.requests)) return state;
      } catch { /* A damaged demo snapshot is replaced by the known seed. */ }
    }
    const state = initialState();
    write(state);
    if (raw !== null) onRecovery?.('ข้อมูลสาธิตเดิมอ่านไม่ได้ จึงคืนข้อมูลตัวอย่างเริ่มต้นแล้ว');
    return state;
  }

  return {
    getRequests({ status, onRecovery } = {}) {
      if (status && !statuses.has(status)) throw new Error('สถานะคำร้องไม่ถูกต้อง');
      const requests = read(onRecovery).requests;
      return clone(status ? requests.filter((request) => request.status === status) : requests);
    },
    getRequestById(id) {
      return clone(read().requests.find((request) => request.id === id) ?? null);
    },
    addRequest(input) {
      const normalized = validateInput(input);
      const state = read();
      const request = { id: `REQ-${String(state.nextSequence).padStart(3, '0')}`, ...normalized, status: 'pending' };
      state.nextSequence += 1;
      state.requests.push(request);
      write(state);
      return clone(request);
    },
    updateRequestStatus(id, status) {
      if (!statuses.has(status)) throw new Error('สถานะคำร้องไม่ถูกต้อง');
      const state = read();
      const request = state.requests.find((item) => item.id === id);
      if (!request) throw new Error('ไม่พบคำร้องที่ต้องการแก้ไข');
      request.status = status;
      write(state);
      return clone(request);
    },
    deleteRequest(id) {
      const state = read();
      if (!state.requests.some((request) => request.id === id)) throw new Error('ไม่พบคำร้องที่ต้องการลบ');
      state.requests = state.requests.filter((request) => request.id !== id);
      return write(state);
    },
    resetRequests() {
      return write(initialState());
    },
  };
}
