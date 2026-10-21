# LAB07 — Pages verification

ตรวจวันที่ **2026-10-21** ด้วย Node.js **v24.18.0** จาก branch `lab/week-07` ก่อนเพิ่มรายงาน (`5f9dbb4a9ac4e751c16adba8e7c45124685c467a`)

Pages แสดงรายงาน, API contract และภาพหลักฐาน ส่วนระบบ React + Express ต้องรันทั้งสองโปรแกรม API client ใช้ `VITE_API_BASE_URL` และค่าเริ่มต้น `http://localhost:3001` จึงไม่สามารถใช้ Pages เป็น Express server ได้

## ผลตรวจจริง

ติดตั้งด้วย `npm ci --no-audit --no-fund` ที่ repository root, `starter/api/` และ `starter/frontend/` สำเร็จ Dependency ที่ root ใช้สำหรับ import `supertest` ของ Week07 checker

| คำสั่ง | ตำแหน่งรัน | ผลจริง |
|---|---|---|
| `npm test` | `starter/api/` | **pass**, 6/6 tests, 0 fail, exit 0 |
| `node check-week07.mjs` | `starter/` | **partial**, 35/36, exit 0 |
| `npm run verify` | `starter/frontend/` | **fail**, LAB05 checker 126/136, exit 1; ไม่ถึงขั้น build |
| `npm run build` | `starter/frontend/` | **pass**, Vite build 41 modules, exit 0 |

Week07 checker:

```text
ในห้อง (CP09–CP12)  24/25
ที่บ้าน (CP13–CP16)  8/8
Challenge            3/3
รวม                  35/36
รายการที่ขาด: api/.env.example
```

API tests ผ่านการคืนรายการ, การค้นที่พบ/ไม่พบ, การสร้างคำร้อง, การตรวจข้อมูลไม่ครบ และ CORS header นอกจากนี้ Week07 checker ตรวจ preflight และ PUT เปลี่ยนสถานะได้

## ข้อจำกัดของ frontend verifier

`starter/frontend/scripts/check-project.mjs` ระบุว่าเป็น **LAB05 checker v2** และยังตรวจ contract แบบ localStorage เดิม จึงมี 10 รายการไม่ผ่านเมื่อใช้กับ Week07:

- คาดว่า `requestService.js` ตรวจ `response.ok` โดยตรง ขณะที่มีการตรวจใน `apiClient.js`
- ห้าม direct fetch ใน `apiClient.js` ซึ่งเป็นไฟล์ที่ Week07 ตั้งใจใช้เรียก fetch
- การทดสอบรายละเอียดคำร้อง 2 รายการใช้รูปแบบ mock ของ service เดิม
- อีก 6 รายการคาดหวังการอ่าน/กู้คืน localStorage, สร้าง ID ฝั่ง client, validate ฝั่ง service, ลบพร้อม persist และ reset พร้อม persist

จึงบันทึกผลรวมเป็น **partial** ไม่แก้ source หรือเปลี่ยน checker เพื่อให้คะแนนผ่าน `npm run build` รันแยกและสร้าง production output สำเร็จ แต่ไม่ได้ยืนยันว่า frontend ใช้งานจริงบน Pages ได้เมื่อไม่มี API

## ภาพหลักฐานเดิม

ภาพเหล่านี้มีอยู่แล้วใน branch ก่อนการตรวจครั้งนี้ และตรวจดูเนื้อหาภาพแล้ว:

- `starter/evidence/images/app-with-api.png`: Dashboard แสดงข้อมูล 3 คำร้อง และ Network requests
- `starter/evidence/images/network-cors-ok.png`: Network แสดง `Access-Control-Allow-Origin: http://localhost:5173`
- `starter/evidence/images/error-state.png`: ภาพแสดง loading และ requests ที่ pending; แม้ชื่อไฟล์เป็น error-state แต่ยังไม่แสดงข้อความ error จึงไม่ใช้ยืนยัน error UI

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

`npm start` ใช้ค่าเริ่มต้นของ config ได้โดยไม่ต้องมี `.env`; คำสั่ง `npm run dev` ของ API มี `--env-file=.env` จึงต้องเตรียมไฟล์เองหากเลือกใช้คำสั่งนั้น เปิด frontend ที่ `http://localhost:5173` และ API ที่ `http://localhost:3001`
