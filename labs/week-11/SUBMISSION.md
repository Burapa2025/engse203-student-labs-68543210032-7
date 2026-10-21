# LAB11 — Full-Stack Production Integration

- Student ID: 68543210032
- Branch: `lab/week-11`
- [Source snapshot](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/tree/fd88479ed35d1fdbf95ebae6f704150f1c02ca2d/labs/week-11/lab11/source) · commit `fd88479ed35d1fdbf95ebae6f704150f1c02ca2d`
- [View Result](https://engse203-student-labs-68543210032-7.onrender.com/)
- [Evidence](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/tree/lab/week-11/labs/week-11/evidence)
- [Pull Request #17](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/pull/17)
- [LAB Portfolio](https://burapa2025.github.io/engse203-student-labs-68543210032-7/)

## Submission scope

โค้ดของ LAB นี้มีอยู่บน main แล้ว เอกสารนี้รวบรวมรายการส่งงาน ลิงก์ผลงาน และหลักฐานสำหรับตรวจสอบผ่าน Pull Request ของ branch ประจำแลบ

## Recorded verification

ผลด้านล่างคัดจาก lab-metadata.json และ evidence/PAGES_VERIFICATION.md ที่บันทึกไว้ก่อนเปิด PR นี้ การเพิ่มเอกสารส่งงานครั้งนี้ไม่ได้รันทดสอบแอปซ้ำ

สถานะผลทดสอบที่บันทึกไว้: **partial**

| รายการ | ผลที่บันทึกไว้ | รายละเอียด |
|---|---|---|
| Frontend production build | pass | Vite 8.1.5 build สำเร็จ 41 modules; bundle ไม่ฝัง localhost:3001 (รันจาก lab11/source/) |
| API integration tests | pass | 8/8 ครอบคลุม GET, filter, พบ/ไม่พบ id, POST/validation และ SQL injection บน SQLite ในหน่วยความจำ |
| LAB11 checker | partial | 34/41: ในห้อง 17/17, ที่บ้าน 14/20, Challenge 3/4; ขาด README ที่สมบูรณ์, DATABASE_CHOICES.md, DEMO.md, .env.production และ CI |
| LAB10 regression checker | pass | 31/31 บน SQLite ในหน่วยความจำ |
| LAB07 regression checker | partial | 35/36; ขาด api/.env.example |

## Notes

เผยแพร่หลักฐานระบบ React + Express + SQLite แบบ production บน GitHub Pages; API และฐานข้อมูลต้องรันบน Node.js แยกต่างหาก ผลตรวจในห้องครบ แต่เอกสารส่งงานบางส่วนยังไม่ครบ

- รวม config, health check, error handling และ logging ของระบบ 3 ชั้น
- Production Express เสิร์ฟ frontend build และ API จากพอร์ตเดียว
- API integration tests ผ่าน 8/8 และ checker LAB10 ผ่าน 31/31
- Checker LAB11 ผ่าน 34/41 โดยส่วนในห้องผ่าน 17/17; รายการเอกสารส่งงานและ CI บางส่วนยังขาด
