# บันทึกการไล่ปัญหา (Debug Log)

🏫 **TODO W12-LOG (CP45 · CP47)** — แต่ละ bug ตอบ 6 ข้อ · เขียนสั้น ๆ แต่ต้องชัด

> BUG #0 ไม่มีผู้ใช้แจ้ง — คุณจะเจอเองตอนเขียน unit test ค่าขอบใน CP45
> BUG #1–#3 มาจาก `BUG_REPORTS.md`

---

## BUG #0 · รายละเอียด 10 ตัวอักษรพอดี ถูกปฏิเสธ (เจอเองจาก unit test)

- **อาการ:** ส่งคำร้องที่รายละเอียดยาว 10 ตัวอักษรพอดี (ตรงตามกฎ "อย่างน้อย 10") แต่ระบบปฏิเสธ บอกว่า "รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร" — ไม่มีผู้ใช้แจ้ง เจอเองตอนเขียน unit test ค่าขอบ
- **วิธีทำซ้ำ:** เขียน unit test ใน `api/tests/unit/requestValidator.test.js` เรียก `validateRequestInput({ ...valid, details: '1234567890' })` (10 ตัวอักษรพอดี) แล้วคาดหวัง error ว่าง → test fail
- **เครื่องมือ:** unit test (Vitest) — อ่าน Expected / Received จากผลรัน test
- **สาเหตุ (ไฟล์:บรรทัด):** `api/src/validators/requestValidator.js:37` — เงื่อนไขใช้ `<=` (น้อยกว่าหรือเท่ากับ) แทนที่จะเป็น `<` ทำให้ค่า 10 พอดีถูกนับว่าไม่ผ่านด้วย
- **วิธีแก้:** เปลี่ยนเงื่อนไขเป็น `readText(input.details).length < MIN_DETAILS` ให้ตรงกับกฎ "อย่างน้อย 10 ตัวอักษร" (แก้โค้ดให้ตรงกับกฎ ไม่ใช่แก้ test ให้ตรงกับโค้ด)
- **test ที่กัน:** `api/tests/unit/requestValidator.test.js` → `'10 ตัวอักษร → ผ่าน (เท่ากับขอบ)'` และ `'9 ตัวอักษร → error (ต่ำกว่าขอบ 1)'`

## BUG #1 · ลบคำร้องแล้วเพิ่มใหม่ ได้ 500

- **อาการ:** ลบคำร้องรหัสกลาง ๆ (เช่น REQ-002) แล้วส่งคำร้องใหม่ → API ตอบ 500 Internal Server Error แทนที่จะเป็น 201
- **วิธีทำซ้ำ:** `curl -X DELETE localhost:3001/api/requests/REQ-002` แล้ว `curl -X POST localhost:3001/api/requests -d '{...ข้อมูลถูกต้อง}'` → ได้ 500 ทุกครั้ง
- **เครื่องมือ:** breakpoint ใน JavaScript Debug Terminal — ตั้งจุดหยุดใน `nextId()` แล้วดูค่าที่คำนวณได้ในแผง VARIABLES เห็นว่าได้รหัส REQ-005 ซ้ำกับที่มีอยู่แล้ว
- **สาเหตุ (ไฟล์:บรรทัด):** `api/src/services/requestService.js:101` (ฟังก์ชัน `nextId()`) — คำนวณรหัสถัดไปจาก `COUNT(*) + 1` พอลบ REQ-002 ไป จำนวนแถวเหลือ 4 → ได้รหัส REQ-005 ซ้ำกับคำร้องที่มีอยู่ → INSERT ชน PRIMARY KEY จึง 500
- **วิธีแก้:** เปลี่ยนมาใช้ `SELECT MAX(id)` แล้ว +1 จากตัวเลขสูงสุดของรหัสปัจจุบัน (REQ-005 → REQ-006) รหัสจะไม่ซ้ำไม่ว่าจะลบรายการไหนไป
- **test ที่กัน:** `api/tests/integration/requests.api.test.js` → `'ลบ REQ-002 แล้ว POST → 201 ได้รหัสถัดไปที่ไม่ซ้ำ (REQ-006 ไม่ใช่ REQ-005)'`

## BUG #2 · Dashboard แสดง "กำลังดำเนินการ 0"

- **อาการ:** การ์ด "กำลังดำเนินการ" บน Dashboard แสดง 0 ทั้งที่มีคำร้องสถานะ in-progress อยู่ 2 รายการ
- **วิธีทำซ้ำ:** เปิด Dashboard (`npm run dev --prefix frontend`) ดูการ์ดสรุป → แสดง "กำลังดำเนินการ 0" ทั้งที่ตารางมีรายการ in-progress
- **เครื่องมือ:** Chrome DevTools → แท็บ Network → ดู Response ของ `GET /api/requests` เห็น `"status": "in-progress"` (API ส่งค่าถูกต้อง) → ปัญหาจึงอยู่ฝั่ง frontend ไม่ใช่ API → ใช้ unit test จับต่อ
- **สาเหตุ (ไฟล์:บรรทัด):** `frontend/src/utils/requestSummary.js:12` — ฟังก์ชัน `summarizeRequests` นับด้วย `count('in progress')` (เว้นวรรค) แต่ API ส่งค่ามาเป็น `'in-progress'` (ยัติภังค์) เทียบกันแล้วไม่ตรงจึงนับได้ 0
- **วิธีแก้:** เปลี่ยนเป็น `count('in-progress')` ให้ตรงกับค่าที่ API ส่งมาจริง (แยกชั้นให้ชัด: API ถูกแล้ว จึงแก้ที่ frontend เท่านั้น)
- **test ที่กัน:** `frontend/src/utils/requestSummary.test.js` → `'นับตามค่า status จริงจาก API → inProgress = 2'`

## BUG #3 · เปลี่ยนสถานะคำร้องที่ไม่มีอยู่ ได้ 500

- **อาการ:** เปลี่ยนสถานะของคำร้องที่ไม่มีในระบบ (เช่น REQ-999) → API ตอบ 500 Internal Server Error แทนที่ควรจะเป็น 404 Not Found
- **วิธีทำซ้ำ:** `curl -X PUT localhost:3001/api/requests/REQ-999 -H "Content-Type: application/json" -d '{"status":"completed"}'` → ได้ 500 ทุกครั้ง
- **เครื่องมือ:** อ่าน stack trace จาก terminal ของ API — บรรทัดแรกบอกว่า `TypeError: Cannot read properties of null (reading 'id')` และบรรทัดแรกที่เป็นไฟล์ของเราชี้มาที่ `requestController.js:30` ใน `updateRequestStatus`
- **สาเหตุ (ไฟล์:บรรทัด):** `api/src/controllers/requestController.js:30` — `console.log` ใช้ `updated.id` ทันทีที่ `service.updateStatus()` คืนค่า ซึ่งคืน `null` เมื่อไม่พบคำร้อง (เช็ค `if (!updated)` ไว้หลัง log) → อ่าน property ของ null พังก่อนจะถึง 404
- **วิธีแก้:** ย้าย `console.log` ไปไว้หลังเช็ค `if (!updated) return 404` — จะ log เฉพาะเมื่อเปลี่ยนสถานะสำเร็จ
- **test ที่กัน:** `api/tests/integration/requests.api.test.js` → `'PUT /api/requests/REQ-999 → 404 ไม่ใช่ 500'`
