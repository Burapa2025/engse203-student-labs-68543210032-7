# LAB10 — Pages verification

ตรวจเมื่อ 21 ตุลาคม 2026 (Asia/Bangkok) ด้วย Node.js v24.18.0
Branch: `lab/week-10`
Source commit: `af84f2665306bea2a5e62ea729d4afe533f1a4ac`
Source directory: `labs/week-10/source/`

## ผลลัพธ์ที่เผยแพร่

GitHub Pages แสดงแอป Campus Service Request ของ LAB10 ตามหน้า Dashboard อ้างอิง พร้อมข้อมูลตัวอย่าง 10 รายการ: pending 5, in-progress 3 และ completed 2 ผู้ใช้ทดลองกรอง สร้างคำร้อง เปิดรายละเอียด เปลี่ยนสถานะ ลบ และ Reset Demo Data ได้ การเปลี่ยนแปลงเก็บใน localStorage ของเบราว์เซอร์นี้โดยใช้คีย์ `engse203-week-10-pages-demo-v1` แยกจากแลบอื่น

เวอร์ชันนี้ระบุบนหน้า Dashboard, About และ footer ว่าเป็นข้อมูลสาธิตที่บันทึกในเบราว์เซอร์ ไม่ได้รัน Express หรือ SQLite บน GitHub Pages โหมดปกติยังใช้ React frontend, Express API และฐานข้อมูล SQLite ผ่าน `node:sqlite` และเรียก API ที่ `http://localhost:3001` เป็นค่าเริ่มต้น

## ตรวจการแก้ไข Pages Dashboard วันที่ 21 ตุลาคม 2026

| คำสั่ง | ผล | รายละเอียด |
|---|---|---|
| `npm run test:pages --prefix frontend` | PASS 10/10 | ทดสอบ seed/ตัวกรอง 5/3/2, CRUD, status update, persistence หลังสร้าง service ใหม่, validation ไม่เปลี่ยนข้อมูลเมื่อปฏิเสธ, reset เฉพาะแลบนี้, corrupt snapshot recovery และ storage failure |
| `npm run build --prefix frontend` | PASS | Vite 8.1.5, 43 modules; build ปกติใช้ API ตามเดิม |
| `npm run build:pages --prefix frontend` | PASS | ตั้ง `VITE_PAGES_DEMO=true` เฉพาะ process build; 43 modules; ไม่มี `localhost:3001` หรือ `/api/requests` ใน JavaScript ที่เผยแพร่ |

Frontend ใช้ Vite `base: './'` และ HashRouter จึงเปิดจาก subdirectory `/labs/week-10/` และรีเฟรชหน้ารายละเอียดได้ คัดลอกเฉพาะไฟล์จาก `frontend/dist/` เข้า `labs/week-10/publish/` ไม่มี dependencies, `.env` หรือฐานข้อมูลในผล build โหมดสาธิตไม่มีการเรียก API และสามารถทดลองข้อมูลโดยไม่ต้องเปิด backend

ผล checker ของงาน API ด้านล่างเป็นผลเดิมก่อนการเพิ่ม Pages Dashboard ไม่ได้นับการทดสอบ adapter ใหม่นี้เป็นการผ่าน checker ของ SQLite API สถานะรวมใน metadata จึงยังเป็น `partial`

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

สถานะรวมเป็น `partial` ส่วนที่เปลี่ยนในครั้งนี้คือ frontend และ Pages adapter โดยไม่มีการแก้ Express API/SQLite หรือเปลี่ยนผล checker เดิมให้ผ่าน

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
