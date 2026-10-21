# LAB07 — Dashboard on Pages

ปรับและตรวจวันที่ **2026-10-21** บน branch `lab/week-07` ด้วย Node.js **v24.18.0**

## หน้าเว็บตามภาพตัวอย่าง

`publish/` เป็น production output ของแอป React ที่มีหัวข้อ **ENGSE203 • LAB 07**, **Campus Service Request**, eyebrow **REACT + EXPRESS API**, เมนู Dashboard / New Request / About, สรุปจำนวน 3 / 1 / 1 / 1 และคำร้องตัวอย่างตรงกับ `starter/api/data/initialRequests.json`

GitHub Pages เปิดเป็น **Pages Demo** ซึ่งระบุบน Dashboard ว่าข้อมูลสาธิตบันทึกในเบราว์เซอร์นี้ ใช้งาน filter, สร้างคำร้อง, เปิดรายละเอียด, เปลี่ยนสถานะ, ลบ และ Reset Demo Data ได้จริง ปุ่ม Reset ในโหมดสาธิตคืน seed ทันทีพร้อมแสดงข้อความสำเร็จ การแก้ไขอยู่ใน localStorage key `engse203-week-07-pages-demo-v1` จึงไม่ปะปนกับแลบอื่น และยังอยู่หลัง reload หน้า เมื่อข้อมูลเสียจะคืน seed พร้อมแสดงข้อความแจ้งผู้ใช้

โหมดนี้เปิดเฉพาะ `npm run build:pages` ด้วย Node helper `scripts/build-pages.mjs` ที่กำหนด public flag `VITE_PAGES_DEMO=true` แล้วเรียก Vite ใน mode pages คำสั่งเดียวกันใช้ได้บน Windows และระบบอื่นโดยไม่ต้องมีไฟล์ environment การรัน `npm run dev` หรือ `npm run build` ปกติยังใช้ Express ผ่าน `apiClient` และ `VITE_API_BASE_URL` (ค่าเริ่มต้น `http://localhost:3001`) ตามเดิม ไม่มีการเปลี่ยน API เป็น localStorage โดยอัตโนมัติเมื่อเชื่อมต่อไม่สำเร็จ

## ผลตรวจรอบนี้

ติดตั้งด้วย `npm ci --no-audit --no-fund` ที่ `starter/frontend/` และ `starter/api/` สำเร็จ

| คำสั่ง | ตำแหน่งรัน | ผลจริง |
|---|---|---|
| `npm run test:pages` | `starter/frontend/` | **pass**, 8/8 tests, 0 fail, exit 0 |
| `npm run build` | `starter/frontend/` | **pass**, Vite production mode, 42 modules, exit 0 |
| `npm run build:pages` | `starter/frontend/` | **pass**, Vite pages mode, 42 modules, exit 0 |
| `npm test` | `starter/api/` | **pass**, 6/6 tests, 0 fail, exit 0 |

Pages tests ตรวจ seed และ filter ทั้ง 3 สถานะ, การคืนข้อมูลแบบ copy, create/update/delete ที่คงอยู่หลังสร้าง service instance ใหม่, validation และ 404, ลบจนว่างแล้ว reload, reset seed, แยก storage จาก LAB10, recovery เมื่อ JSON เสีย, storage failure, seed ผิด schema, error/empty scenarios และยืนยันว่า service โหมดปกติยังส่ง request ไป Express API

คัดลอกเฉพาะไฟล์ใน `starter/frontend/dist/` ไป `publish/` ไม่มี dependency, source ของ backend หรือ secret ใน output ใช้ Vite `base: './'` และ HashRouter เพื่อเปิดจากโฟลเดอร์ย่อยของ GitHub Pages ได้

## ผล checker เดิมที่ยังคงไว้

การเปลี่ยนรอบนี้ไม่ได้แก้ checker เดิมเพื่อเปลี่ยนผลคะแนน ผลก่อนปรับ Pages เมื่อวันที่เดียวกันยังบันทึกไว้ดังนี้:

- `node check-week07.mjs` ที่ `starter/`: **partial 35/36**, exit 0; ในห้อง 24/25, ที่บ้าน 8/8, Challenge 3/3; ขาด `api/.env.example`
- `npm run verify` ที่ `starter/frontend/`: **fail 126/136**, exit 1 เนื่องจากเป็น LAB05 checker v2 ที่ตรวจ contract แบบ localStorage เดิมและห้าม direct fetch ใน `apiClient.js` ซึ่งเป็นสถาปัตยกรรมที่ Week07 ตั้งใจใช้

จึงยังคง `testStatus: partial` ใน metadata แม้ API tests, Pages tests และ production builds รอบนี้ผ่านทั้งหมด

## รันในเครื่อง

Terminal 1:

```sh
cd labs/week-07/starter/api
npm ci
npm start
```

Terminal 2:

```sh
cd labs/week-07/starter/frontend
npm ci
npm run dev
```

เปิด frontend ที่ `http://localhost:5173` และ API ที่ `http://localhost:3001` คำสั่ง `npm start` ของ API ใช้ config เริ่มต้นได้โดยไม่ต้องมี `.env` ส่วน `npm run dev` ของ API ใช้ `--env-file=.env` จึงต้องเตรียมไฟล์หากเลือกคำสั่งนั้น

สำหรับดู Pages Demo ในเครื่อง:

```sh
cd labs/week-07/starter/frontend
npm run test:pages
npm run build:pages
npm run preview
```

## ภาพหลักฐานเดิม

ภาพใน `starter/evidence/images/` เป็นภาพการใช้งาน API จาก branch เดิมก่อนปรับ Pages:

- `app-with-api.png`: Dashboard แสดงข้อมูล 3 คำร้อง และ Network requests
- `network-cors-ok.png`: Network แสดง `Access-Control-Allow-Origin: http://localhost:5173`
- `error-state.png`: ภาพแสดง loading และ requests ที่ pending; ยังไม่แสดงข้อความ error จึงไม่ใช้ยืนยัน error UI

## Browser smoke test — 2026-10-21

ตรวจ production Pages build ผ่าน HTTP ใต้ subpath ของ repository ใน Codex in-app browser:

- Dashboard เริ่มต้น 3 รายการ สถานะ 1/1/1 และตัวกรอง pending แสดง 1 รายการ
- สร้างคำร้องจากแบบฟอร์ม เปิดหน้ารายละเอียด เปลี่ยนเป็น completed ได้
- รีเฟรชหน้ารายละเอียดแล้วยังแสดงข้อมูลและสถานะที่บันทึกไว้
- ลบคำร้องที่สร้างและข้อมูลตัวอย่างได้ ยอดสรุปเปลี่ยนตามรายการจริง
- Reset Demo Data คืนข้อมูลเริ่มต้นครบ 3 รายการทันทีในโหมด Pages
