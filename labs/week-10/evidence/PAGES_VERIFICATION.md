# LAB10 — Pages verification

ตรวจเมื่อ 21 ตุลาคม 2026 (Asia/Bangkok) ด้วย Node.js v24.18.0
Branch: `lab/week-10`
Source commit: `af84f2665306bea2a5e62ea729d4afe533f1a4ac`
Source directory: `labs/week-10/source/`

## ผลลัพธ์ที่เผยแพร่

GitHub Pages แสดงรายงานผลตรวจและลิงก์ source/API contract ของแลบนี้ ระบบจริงประกอบด้วย React frontend, Express API และฐานข้อมูล SQLite ผ่าน `node:sqlite` GitHub Pages เสิร์ฟไฟล์ static จึงต้องรัน API ด้วย Node.js บนเครื่องหรือ backend host เพื่อใช้งานระบบครบวงจร

Frontend ใช้ Vite `base: './'` และ HashRouter แต่เรียก API ที่ `http://localhost:3001` เป็นค่าเริ่มต้น การนำ `dist/` ขึ้น Pages เพียงอย่างเดียวจะไม่ทำให้ API และ SQLite ทำงาน

## การเตรียมและแยกสภาพแวดล้อม

ติดตั้ง dependency จาก lockfile ที่ repository root, `source/api/` และ `source/frontend/` ด้วย `npm ci --include=dev --no-audit --no-fund` Root dependency จำเป็นสำหรับ checker รุ่นนี้ที่ import `supertest` จากระดับ source

ก่อนทดสอบ ตั้งค่าใน PowerShell ของ process ทดสอบ:

```powershell
$env:DB_FILE=':memory:'
$env:NODE_ENV='test'
$env:DOTENV_CONFIG_PATH='__pages_verification_no_env__'
$env:DOTENV_CONFIG_QUIET='true'
Remove-Item Env:TURSO_DATABASE_URL,Env:TURSO_AUTH_TOKEN -ErrorAction SilentlyContinue
```

ทุก checker/test ทำงานใน process แยกกันและใช้ SQLite ในหน่วยความจำ ไม่แก้ไข `api/data/campus.db` ที่ commit ไว้ ไม่โหลดไฟล์ `.env` หรือใช้ฐานข้อมูลภายนอก

## ผลการตรวจจริง

รันคำสั่งต่อไปนี้จาก `labs/week-10/source/`:

| คำสั่ง | ผล | รายละเอียด |
|---|---|---|
| `npm run build --prefix frontend` | PASS | Vite 8.1.5 build สำเร็จ 41 modules |
| `node --disable-warning=ExperimentalWarning check-week10.mjs` | PARTIAL | 22/31: ในห้อง 17/20, ที่บ้าน 5/8, Challenge 0/3 |
| `node --disable-warning=ExperimentalWarning check-week07.mjs` | PARTIAL | 32/36: ในห้อง 24/25, ที่บ้าน 5/8, Challenge 3/3 |
| `npm test --prefix api` | PARTIAL | process exit 0 และแสดง 1/1 แต่มีเพียง placeholder `assert.ok(true)` |

Checker เหล่านี้คืน exit code 0 แม้มีรายการ `[TODO]` จึงใช้จำนวนรายการที่ผ่านและตรวจรายละเอียด ไม่ใช้ exit code อย่างเดียว

### รายการที่ยังไม่ผ่าน

- SQLite ใหม่จาก schema ไม่มีข้อมูลคำร้องตั้งต้น จึงคืน array ว่าง และ `GET /api/requests/REQ-001` เป็น 404; checker ที่คาดว่ามี REQ-001 จึงไม่ผ่าน อย่างไรก็ตาม checker LAB10 สร้างคำร้องใหม่ แก้ไข ลบ และทดสอบ SQL injection ได้สำเร็จ
- API test เดิมยังไม่ได้ยิงคำขอจริงด้วย supertest และมีน้อยกว่า 6 เคส
- ไม่มี `api/.env.example` ใน source ที่ commit ไว้
- API contract ยังไม่ผ่านเงื่อนไขหัวข้อ data model/ฐานข้อมูลของ checker
- Challenge users endpoint, transaction และ index ยังไม่ผ่าน

สถานะรวมเป็น `partial` ไม่มีการแก้โค้ดการบ้านหรือเปลี่ยนผลตรวจให้ผ่านในงานเผยแพร่ครั้งนี้

## วิธีรันระบบในเครื่อง

จาก repository root ติดตั้ง API/frontend ตามคำสั่งใน metadata แล้วเปิดสอง terminal:

```powershell
# Terminal 1
npm start --prefix labs/week-10/source/api
```

```powershell
# Terminal 2
npm run dev --prefix labs/week-10/source/frontend
```

เปิด URL ที่ Vite แสดง (โดยปกติ `http://localhost:5173`) โดย API ใช้พอร์ต 3001 การเปลี่ยน backend host ต้องตั้ง `VITE_API_BASE_URL` และ CORS ให้ตรงกัน
