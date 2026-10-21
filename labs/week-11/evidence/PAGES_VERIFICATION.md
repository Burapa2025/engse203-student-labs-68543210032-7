# LAB11 — Pages verification

ตรวจเมื่อ 21 ตุลาคม 2026 (Asia/Bangkok) ด้วย Node.js v24.18.0
Branch: `lab/week-11`
Source commit: `6a891030c8159cefa8a600a136f41ffaf0f2377b`
Source directory: `labs/week-11/lab11/source/`

## ผลลัพธ์ที่เผยแพร่

GitHub Pages แสดงรายงานผลตรวจและลิงก์ source/API contract ของแลบนี้ ระบบจริงประกอบด้วย React frontend, Express API และ SQLite `node:sqlite` API ต้องรันบน Node.js และมีไฟล์/หน่วยความจำฐานข้อมูล GitHub Pages จึงแสดง evidence report ของระบบ

Frontend ใช้ Vite `base: './'` และ HashRouter แต่เรียก `/api/...` บน origin เดียวกันเป็นค่าเริ่มต้น Express production เป็นผู้เสิร์ฟทั้ง `frontend/dist/` และ API จากพอร์ตเดียว การวางเฉพาะ frontend build บน Pages จะไม่มี API รองรับ

## การเตรียมและแยกสภาพแวดล้อม

ติดตั้ง dependency จาก lockfile ที่ `lab11/source/api/` และ `lab11/source/frontend/` ด้วย `npm ci --include=dev --no-audit --no-fund`

ก่อนทดสอบ ตั้งค่าใน PowerShell ของ process ทดสอบ:

```powershell
$env:DB_FILE=':memory:'
$env:NODE_ENV='test'
$env:DOTENV_CONFIG_PATH='__pages_verification_no_env__'
$env:DOTENV_CONFIG_QUIET='true'
Remove-Item Env:TURSO_DATABASE_URL,Env:TURSO_AUTH_TOKEN -ErrorAction SilentlyContinue
```

ทุก checker/test ทำงานใน process แยกกันและใช้ SQLite ในหน่วยความจำ ไม่แก้ไข `api/data/campus.db` ที่ commit ไว้ ไม่โหลดไฟล์ `.env` หรือใช้ฐานข้อมูลภายนอก Checker LAB11 สร้าง subprocess โหมด production เพื่อพิสูจน์ว่า `GET /` ตอบหน้า HTML หลัง build และยังใช้ฐานข้อมูลในหน่วยความจำ

## ผลการตรวจจริง

รันคำสั่งต่อไปนี้จาก `labs/week-11/lab11/source/`:

| คำสั่ง | ผล | รายละเอียด |
|---|---|---|
| `npm run build --prefix frontend` | PASS | Vite 8.1.5 build สำเร็จ 41 modules |
| `npm test --prefix api` | PASS | 8/8 tests, 4 suites; GET/filter/id, POST/validation และ SQL injection |
| `node --disable-warning=ExperimentalWarning check-week11.mjs` | PARTIAL | 34/41: ในห้อง 17/17, ที่บ้าน 14/20, Challenge 3/4 |
| `node --disable-warning=ExperimentalWarning check-week10.mjs` | PASS | 31/31: ในห้อง 20/20, ที่บ้าน 8/8, Challenge 3/3 |
| `node --disable-warning=ExperimentalWarning check-week07.mjs` | PARTIAL | 35/36: ขาด `api/.env.example` |

Checker เหล่านี้คืน exit code 0 แม้มีรายการ `[TODO]` จึงใช้จำนวนรายการที่ผ่านและตรวจรายละเอียด ไม่ใช้ exit code อย่างเดียว

### รายการที่ยังไม่ผ่านหรือยังไม่ได้พิสูจน์

- README ระบบยังสั้นและไม่มีคำอธิบายสถาปัตยกรรม/วิธีรันครบตาม checker
- ไม่มี `DATABASE_CHOICES.md` และหลักฐานสาธิต `DEMO.md`/ลิงก์วิดีโอ
- ไม่มี `frontend/.env.production` และ `api/.env.example` ที่ commit ไว้ แม้ source ปัจจุบันใช้ API base ว่างและ production bundle ไม่ฝัง localhost:3001
- ไม่มี `.github/workflows` ภายใน source ตามเงื่อนไข Challenge ของ checker
- `render.yaml` ยังอ้าง `rootDir: labs/week-11-fullstack-integration/lab11/starter/` ซึ่งไม่ตรงกับตำแหน่ง source จริง ต้องปรับก่อน deploy backend ด้วย config นี้
- ไม่มีหลักฐาน URL backend ที่ deploy แล้ว การตรวจ production ที่ผ่านเป็นการทดสอบในเครื่องผ่าน supertest

สถานะรวมเป็น `partial` เนื่องจากยังมีรายการเอกสาร/การเตรียมส่งงานไม่ครบ ไม่มีการแก้โค้ดการบ้านในงานเผยแพร่ครั้งนี้

## วิธีรันระบบในเครื่อง

จาก repository root ติดตั้ง API/frontend ตามคำสั่งใน metadata แล้วเปิดสอง terminal:

```powershell
# Terminal 1
npm start --prefix labs/week-11/lab11/source/api
```

```powershell
# Terminal 2
$env:VITE_API_BASE_URL='http://localhost:3001'
npm run dev --prefix labs/week-11/lab11/source/frontend
```

สำหรับโหมด production ให้ build frontend โดยไม่ตั้ง `VITE_API_BASE_URL` (เพื่อใช้ API origin เดียวกัน) แล้วตั้ง `NODE_ENV=production` ก่อน `npm start --prefix labs/week-11/lab11/source/api` เปิด `http://localhost:3001` เพื่อใช้ frontend และ API พอร์ตเดียว
