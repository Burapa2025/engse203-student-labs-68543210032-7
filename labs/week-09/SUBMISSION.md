# LAB09 — Relational Database & SQL (SQLite)

- Student ID: 68543210032
- Branch: `lab/week-09`
- [Source snapshot](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/tree/07d1aca558f520e6a49806ad3222b083a058ac80/labs/week-09/lab09/source) · commit `07d1aca558f520e6a49806ad3222b083a058ac80`
- [View Result](https://burapa2025.github.io/engse203-student-labs-68543210032-7/labs/week-09/)
- [Evidence](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/tree/lab/week-09/labs/week-09/evidence)
- [Pull Request #15](https://github.com/Burapa2025/engse203-student-labs-68543210032-7/pull/15)
- [LAB Portfolio](https://burapa2025.github.io/engse203-student-labs-68543210032-7/)

## Submission scope

โค้ดของ LAB นี้มีอยู่บน main แล้ว เอกสารนี้รวบรวมรายการส่งงาน ลิงก์ผลงาน และหลักฐานสำหรับตรวจสอบผ่าน Pull Request ของ branch ประจำแลบ

## Recorded verification

ผลด้านล่างคัดจาก lab-metadata.json และ evidence/PAGES_VERIFICATION.md ที่บันทึกไว้ก่อนเปิด PR นี้ การเพิ่มเอกสารส่งงานครั้งนี้ไม่ได้รันทดสอบแอปซ้ำ

สถานะผลทดสอบที่บันทึกไว้: **partial**

| รายการ | ผลที่บันทึกไว้ | รายละเอียด |
|---|---|---|
| Original campus.db checker | partial | 24/30: ในห้อง 9/11, ที่บ้าน 15/16, Challenge 0/3; DB เดิมมี users 3 คน, requests 6 รายการ และ orphan references 3 รายการ |
| Schema, queries and constraints | pass | schema.sql สร้าง 4 users / 8 requests, foreign_key_check ไม่พบปัญหา; SELECT ทั้ง 8 ข้อรันได้ และ NOT NULL, UNIQUE, CHECK, PRIMARY KEY, FOREIGN KEY ปฏิเสธข้อมูลผิดครบ 5 แบบ |

## Notes

Schema, queries, data model, and SQLite database are present in this repository.

- ออกแบบ users และ requests ด้วยความสัมพันธ์แบบหนึ่งต่อหลาย
- มี schema.sql, queries.sql และ DATA_MODEL.md พร้อมเหตุผลการออกแบบ
- ทดสอบ SQL ทั้ง 8 ข้อและ constraints 5 แบบกับฐานข้อมูลใหม่ในหน่วยความจำผ่าน
- เผยแพร่ผลตรวจ campus.db เดิมตามจริง: ข้อมูลยังไม่ครบและมี orphan references; Challenge ยังไม่ทำ
