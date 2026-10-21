# LAB07 — RESTful API, CORS & Frontend Integration

- Student ID: 68543210032
- Branch: `lab/week-07`
- [Source snapshot](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/tree/02dcf184dc4532e4639aab54bb540f5baa3ad8ce/labs/week-07/starter) · commit `02dcf184dc4532e4639aab54bb540f5baa3ad8ce`
- [View Result](https://burapa2025.github.io/engse203-student-labs-68543210032-7/labs/week-07/)
- [Evidence](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/tree/lab/week-07/labs/week-07/evidence)
- [LAB Portfolio](https://burapa2025.github.io/engse203-student-labs-68543210032-7/)

## Submission scope

โค้ดของ LAB นี้มีอยู่บน main แล้ว เอกสารนี้รวบรวมรายการส่งงาน ลิงก์ผลงาน และหลักฐานสำหรับตรวจสอบผ่าน Pull Request ของ branch ประจำแลบ

## Recorded verification

ผลด้านล่างคัดจาก lab-metadata.json และ evidence/PAGES_VERIFICATION.md ที่บันทึกไว้ก่อนเปิด PR นี้ การเพิ่มเอกสารส่งงานครั้งนี้ไม่ได้รันทดสอบแอปซ้ำ

สถานะผลทดสอบที่บันทึกไว้: **partial**

| รายการ | ผลที่บันทึกไว้ | รายละเอียด |
|---|---|---|
| API automated tests | pass | 6/6 tests ผ่าน, 0 fail: GET, POST, validation, 404 และ CORS header |
| Week07 checker | partial | 35/36: ในห้อง 24/25, ที่บ้าน 8/8, Challenge 3/3; ขาด api/.env.example (checker ยังคืน exit code 0) |
| Frontend production build | pass | ตรวจใหม่ 2026-10-21: Vite build สำเร็จ 42 modules; ใช้ Express API ตามเดิม, HashRouter และ base './' |
| Pages demo automated tests | pass | 8/8 tests: seed, filters, CRUD, validation, reload persistence, reset, per-lab isolation, corruption recovery, storage failure, UI scenarios และ default Express API mode |
| Pages frontend build | pass | Vite pages mode สำเร็จ 42 modules; Node build helper เปิด VITE_PAGES_DEMO=true โดยไม่ใช้ไฟล์ environment; คัดลอก dist ไป publish/ พร้อม relative assets และ seed JSON |
| Inherited frontend verifier | fail | LAB05 checker เดิมผ่าน 126/136 และ exit 1; ยังตรวจ localStorage และ direct fetch ตามสถาปัตยกรรมเดิม ขณะที่ Week07 ใช้ API client; รายละเอียดและข้อจำกัดอยู่ในรายงาน |

## Notes

Pages เปิด Dashboard ใช้งานได้ด้วยข้อมูลสาธิตที่บันทึกแยกใน browser storage; การรันปกติยังใช้ Express API จริง API tests ผ่าน 6/6, Pages demo tests ผ่าน 8/8 และ build ทั้งสองโหมดผ่าน; คงผล Week07 checker เดิม 35/36 และข้อจำกัด inherited verifier ไว้ในรายงาน

- เชื่อม React กับ Express ผ่าน apiClient, fetch และ environment config
- รองรับ CORS, preflight, PUT เปลี่ยนสถานะ และ API error handling
- มี API contract, automated tests และภาพหลักฐานจาก branch เดิม
- Pages Demo ใช้งาน Dashboard, filter, สร้างคำร้อง, เปลี่ยนสถานะ, ลบ และ Reset Demo Data พร้อมบันทึกแยกเฉพาะ LAB07
- Build ปกติยังใช้ API จริงที่พอร์ต 3001; build:pages เปิดโหมดสาธิตอย่างชัดเจน
