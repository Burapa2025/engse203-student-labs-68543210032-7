# LAB10 — Node.js & SQLite Integration

- Student ID: 68543210032
- Branch: `lab/week-10`
- [Source snapshot](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/tree/7f0e77d3fda8337a9ecd37c5fd031c5be83066ea/labs/week-10/source) · commit `7f0e77d3fda8337a9ecd37c5fd031c5be83066ea`
- [View Result](https://burapa2025.github.io/engse203-student-labs-68543210032-7/labs/week-10/)
- [Evidence](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/tree/lab/week-10/labs/week-10/evidence)
- [LAB Portfolio](https://burapa2025.github.io/engse203-student-labs-68543210032-7/)

## Submission scope

โค้ดของ LAB นี้มีอยู่บน main แล้ว เอกสารนี้รวบรวมรายการส่งงาน ลิงก์ผลงาน และหลักฐานสำหรับตรวจสอบผ่าน Pull Request ของ branch ประจำแลบ

## Recorded verification

ผลด้านล่างคัดจาก lab-metadata.json และ evidence/PAGES_VERIFICATION.md ที่บันทึกไว้ก่อนเปิด PR นี้ การเพิ่มเอกสารส่งงานครั้งนี้ไม่ได้รันทดสอบแอปซ้ำ

สถานะผลทดสอบที่บันทึกไว้: **partial**

| รายการ | ผลที่บันทึกไว้ | รายละเอียด |
|---|---|---|
| Frontend production build | pass | Vite 8.1.5 build ปกติสำเร็จ 43 modules; requestService ยังใช้ Express API ใน build นี้ |
| Pages demo adapter behavior | pass | 10/10: seed และตัวกรอง 5/3/2, สร้าง/รายละเอียด/สถานะ/ลบ/Reset, persistence, validation, recovery, storage isolation และ storage failure |
| Explicit GitHub Pages production build | pass | VITE_PAGES_DEMO=true; Vite 8.1.5 build สำเร็จ 43 modules; คัดลอก dist เท่านั้นเข้า publish/ ใช้ relative assets และ HashRouter |
| LAB10 checker | partial | 22/31: ในห้อง 17/20, ที่บ้าน 5/8, Challenge 0/3; ฐานข้อมูลใหม่ไม่มีข้อมูลตั้งต้นสำหรับ REQ-001, test ยังเป็น placeholder และเอกสาร/Challenge ยังไม่ครบ |
| LAB07 regression checker | partial | 32/36: ขาด .env.example, REQ-001 ไม่มีในฐานข้อมูลใหม่ และ test ยังไม่ยิง HTTP จริง |
| Existing API test script | partial | process ผ่าน 1/1 แต่เคสทดสอบมีเพียง assert.ok(true); ไม่นับเป็นหลักฐานยืนยันพฤติกรรม API |

## Notes

GitHub Pages แสดง Dashboard LAB10 พร้อมข้อมูลสาธิต 10 รายการ ทดลองสร้าง ดูรายละเอียด กรอง เปลี่ยนสถานะ ลบ และ Reset ได้ โดยเก็บข้อมูลในเบราว์เซอร์แยกจากแลบอื่น; โหมดปกติยังใช้ Express API + SQLite และผล checker เดิมยังเป็น partial

- เชื่อม Express API กับ SQLite ผ่าน node:sqlite และ JOIN เพื่อคืน requesterName
- ใช้ parameterized queries และแยกชั้น route, controller และ service
- Pages Dashboard เริ่มต้น 10 รายการ: pending 5, in-progress 3, completed 2 และทดสอบ adapter ผ่าน 10/10
- Frontend build ปกติและ Pages build ผ่าน; checker LAB10 เดิมผ่าน 22/31 และ checker LAB07 เดิมผ่าน 32/36
- API test เดิมมี 1 placeholder จึงยังยืนยันความครอบคลุมการทดสอบไม่ได้
