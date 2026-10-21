# LAB12 — Campus Service — Testing, Debugging & Regression Tests

- Student ID: 68543210032
- Branch: `lab/week-12`
- [Source snapshot](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/tree/0520ff7256f022fba8da62851afa774435df22c2/labs/week-12/source) · commit `0520ff7256f022fba8da62851afa774435df22c2`
- [View Result](https://campus-service-68543210032-7-week-12.onrender.com/)
- [Evidence](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/tree/lab/week-12/labs/week-12/evidence)
- [Pull Request #18](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/pull/18)
- [LAB Portfolio](https://burapa2025.github.io/engse203-student-labs-68543210032-7/)

## Submission scope

โค้ดของ LAB นี้มีอยู่บน main แล้ว เอกสารนี้รวบรวมรายการส่งงาน ลิงก์ผลงาน และหลักฐานสำหรับตรวจสอบผ่าน Pull Request ของ branch ประจำแลบ

## Recorded verification

ผลด้านล่างคัดจาก lab-metadata.json และ evidence/PAGES_VERIFICATION.md ที่บันทึกไว้ก่อนเปิด PR นี้ การเพิ่มเอกสารส่งงานครั้งนี้ไม่ได้รันทดสอบแอปซ้ำ

สถานะผลทดสอบที่บันทึกไว้: **pass**

| รายการ | ผลที่บันทึกไว้ | รายละเอียด |
|---|---|---|
| API and frontend tests | pass | API: 2 files, 41 tests; frontend: 1 file, 3 tests. All passed using an in-memory SQLite database. |
| Week 12 checker | pass | 22/22 checks: in-class 20/20, challenge 2/2. The isolated copy includes the original branch CI workflow so repository-level CI inspection remains valid. |
| API coverage | pass | 41/41 tests; statements 88.19%, branches 72.41%, functions 87.87%, lines 90.64%. |
| Frontend production build | pass | Vite 8.1.5 built 42 modules and produced dist/index.html with CSS and JavaScript assets. |

## Notes

เผยแพร่รายงานผลทดสอบของ React + Express + SQLite; ระบบจริงต้องมี API และฐานข้อมูลแยกจาก GitHub Pages

- Vitest: API 41/41 และ frontend 3/3 ผ่าน
- ทดสอบค่าขอบ, CRUD และ regression ของปัญหารหัสคำร้องซ้ำ, Dashboard และ 404
- API coverage: statements 88.19%, branches 72.41%, functions 87.87%, lines 90.64%
- Week 12 checker ผ่าน 22/22 รายการ และ frontend production build ผ่าน
