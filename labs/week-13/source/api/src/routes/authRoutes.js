import { Router } from 'express';
import * as authService from '../services/authService.js';
import { validateLoginInput } from '../validators/requestValidator.js';

// route ให้มาแล้ว — งานหลักอยู่ใน services/authService.js (CP50)
const router = Router();

// ⭐ Challenge — จำกัดการเดารหัสผ่าน: ผิด 5 ครั้งใน 15 นาที → อีเมลนั้นถูกล็อก ตอบ 429 ชั่วคราว
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const failedLogins = new Map();   // email → { count, firstAt }

function isLocked(email) {
  const entry = failedLogins.get(email);
  if (!entry) return false;
  if (Date.now() - entry.firstAt > WINDOW_MS) {
    failedLogins.delete(email);   // พ้นหน้าต่าง 15 นาทีแล้ว → เริ่มนับใหม่
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(email) {
  const entry = failedLogins.get(email);
  if (!entry || Date.now() - entry.firstAt > WINDOW_MS) {
    failedLogins.set(email, { count: 1, firstAt: Date.now() });
  } else {
    entry.count += 1;
  }
}

/** ล้างประวัติการล็อก — test เรียกใน beforeEach เพื่อให้แต่ละข้อเริ่มจากสถานะสะอาด */
export function resetLoginLimiter() {
  failedLogins.clear();
}

router.post('/login', (req, res) => {
  const errors = validateLoginInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง', details: errors });
  }
  const email = String(req.body.email).trim().toLowerCase();
  if (isLocked(email)) {
    return res.status(429).json({ error: 'ลองเข้าสู่ระบบผิดหลายครั้งเกินไป กรุณารอ 15 นาทีแล้วลองใหม่' });
  }
  const result = authService.login(req.body.email, req.body.password);
  if (!result) {
    recordFailure(email);
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }
  failedLogins.delete(email);   // เข้าสู่ระบบสำเร็จ → ล้างประวัติของอีเมลนี้
  res.status(200).json(result);
});

export default router;
