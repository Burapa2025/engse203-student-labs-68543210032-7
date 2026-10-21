# LAB13 — Campus Service — Authentication, Authorization & Security

- Student ID: 68543210032
- Branch: `lab/week-13`
- [Source snapshot](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/tree/1c5753ec799147034b8a4d82e6ee5749798b8e6f/labs/week-13/source) · commit `1c5753ec799147034b8a4d82e6ee5749798b8e6f`
- [View Result](https://campus-service-68543210032-7-week-13-x6ds.onrender.com/)
- [Evidence](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/tree/lab/week-13/labs/week-13/evidence)
- [Pull Request #19](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/pull/19)
- [LAB Portfolio](https://burapa2025.github.io/engse203-student-labs-68543210032-7/)

## Submission scope

โค้ดของ LAB นี้มีอยู่บน main แล้ว เอกสารนี้รวบรวมรายการส่งงาน ลิงก์ผลงาน และหลักฐานสำหรับตรวจสอบผ่าน Pull Request ของ branch ประจำแลบ

## Recorded verification

ผลด้านล่างคัดจาก lab-metadata.json และ evidence/PAGES_VERIFICATION.md ที่บันทึกไว้ก่อนเปิด PR นี้ การเพิ่มเอกสารส่งงานครั้งนี้ไม่ได้รันทดสอบแอปซ้ำ

สถานะผลทดสอบที่บันทึกไว้: **pass**

| รายการ | ผลที่บันทึกไว้ | รายละเอียด |
|---|---|---|
| API and frontend tests | pass | API: 4 files, 68 tests; frontend: 1 file, 3 tests. All passed using an in-memory SQLite database. |
| Week 13 security checker | pass | 27/27 checks: in-class 23/23, challenge 4/4. Covers hashing, JWT, 401/403, validation, production secret requirement, security header and login rate limiting. |
| Frontend production build | pass | Vite 8.1.5 built 42 modules and produced dist/index.html with CSS and JavaScript assets. |

## Notes

เผยแพร่รายงานผลทดสอบ JWT, สิทธิ์เจ้าหน้าที่และความปลอดภัย; ระบบจริงต้องมี API และฐานข้อมูลแยกจาก GitHub Pages

- Vitest: API 68/68 และ frontend 3/3 ผ่าน
- ตรวจ password hashing ด้วย scrypt, JWT login และสิทธิ์ 401/403
- ตรวจ validation, body limit, security header และ login rate limit
- Week 13 checker ผ่าน 27/27 รายการ และ frontend production build ผ่าน
