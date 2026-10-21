# ENGSE203 Student LAB Portfolio

Repository เดียวสำหรับเก็บผลงาน LAB ตลอดรายวิชา โดยใช้ branch รายสัปดาห์และ GitHub Pages Hub สำหรับตรวจผลลัพธ์

## เลือกเส้นทางเริ่มต้น

- **รุ่นถัดไป/ยังไม่เริ่ม LAB01:** อ่าน [START_HERE_BEFORE_LAB01.md](./START_HERE_BEFORE_LAB01.md)
- **รุ่นปัจจุบันมี repo LAB01–03 แยกแล้ว:** อ่าน [START_HERE_LAB01_TO_LAB03.md](./START_HERE_LAB01_TO_LAB03.md)
- **ทุกสัปดาห์:** ใช้ [WEEKLY_LAB_WORKFLOW.md](./WEEKLY_LAB_WORKFLOW.md)

```bash
nvm use
npm install
npm run setup -- --student-id 6500000000 --name "ชื่อ นามสกุล" --section SEC1 --github github-user --mode new-course
```

## Repository Contract

| รายการ | รูปแบบ |
|---|---|
| Repository | `engse203-student-labs-<student-id>` |
| Weekly branch | `lab/week-NN` |
| Source | `labs/week-NN/source/` |
| Evidence | `labs/week-NN/evidence/` |
| Publish input | `labs/week-NN/publish/` |
| Pages output | `docs/labs/week-NN/` |
| Pages source | `main /docs` |
| Submission | Pages Hub URL + Weekly Result URL + merged PR URL + submission tag |

## คำสั่งหลัก

```bash
npm run import:source -- week-01 /path/to/old-lab01-repository
npm run import:publish -- week-03 labs/week-03/source
npm run build:pages
npm run verify
```

ถ้า build ซ้ำ ใช้ `--replace` ต่อท้ายคำสั่ง `import:publish` หลังตรวจ week และ path แล้ว

ห้ามแก้ไฟล์ใน `docs/` ด้วยมือ เพราะ `npm run build:pages` จะสร้างใหม่จาก config, metadata และโฟลเดอร์ `publish/`

## Pages URL

```text
https://<github-username>.github.io/engse203-student-labs-<student-id>/
```

## LAB ที่เตรียมไว้

Pages Hub มี LAB01–07 และ LAB09–13 (ไม่มี LAB08) โดยแยก branch `lab/week-NN` ของแต่ละแลบ และสร้างการ์ดจาก `labs/week-NN/` อัตโนมัติ

LAB06 และ LAB09 ใช้หน้าสรุปหลักฐาน ส่วน LAB07 และ LAB10 เปิดเป็น Dashboard สาธิตที่เก็บข้อมูลในเบราว์เซอร์ โดย build ด้วย `VITE_PAGES_DEMO=true` การรัน source แบบปกติยังใช้ Express API/SQLite ตามเดิม LAB11–13 เปิดระบบจริงบน Render ผ่านปุ่ม View Result โดยกำหนด URL ใน metadata.liveUrl และยังเก็บหน้ารายงานหลักฐานบน Pages ไว้ สถานะ `Published` หมายถึงเผยแพร่แล้ว ส่วนผลตรวจสอบของแต่ละแลบแสดงตามผลจริง

metadata รองรับ `sourcePath` และ `evidencePath` ที่อ้างอิงจากโฟลเดอร์ของแลบนั้น เพื่อใช้โครงสร้างงานเดิมได้โดยไม่ต้องย้าย source พร้อม `verification`, `highlights`, `runCommands`, `reportFiles` และ `screenshots` สำหรับสร้างรายงาน และ `reportLayout: "summary"` สำหรับหน้าสรุปแบบย่อ

เปิด Portfolio: https://burapa2025.github.io/engse203-student-labs-68543210032-7/

ปุ่ม Pull Request เปิด PR ที่ระบุใน metadata หากยังไม่มี PR จะเปิดรายการ PR บน GitHub ที่กรองตาม branch ของแลบนั้น โดยไม่สร้าง PR หรือเปลี่ยนสถานะส่งงานอัตโนมัติ

## เพิ่ม LAB ในอนาคต

```bash
npm run add:lab -- week-05 "React Routing and Data"
```

จากนั้นใช้ workflow เดิมกับ `lab/week-05` และ `labs/week-05/`
