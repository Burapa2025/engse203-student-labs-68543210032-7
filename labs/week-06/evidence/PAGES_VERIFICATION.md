# LAB06 — Pages verification

ตรวจวันที่ **2026-10-21** ด้วย Node.js **v24.18.0** จาก branch `lab/week-06` ก่อนเพิ่มรายงาน (`0b4881150e14d1feaf52b6ac7090fa1829812b45`)

GitHub Pages แสดงรายงานและลิงก์ source ของ Express API นี้ การเรียก API จริงต้องรัน Node.js; ข้อมูลคำร้องโหลดจาก `data/initialRequests.json` แล้วเก็บในหน่วยความจำ การเปลี่ยนข้อมูลระหว่างรันไม่ถูกเขียนกลับไฟล์

## คำสั่งที่ตรวจจริง

รันจาก `labs/week-06/lab06/starter/`:

```sh
npm ci --no-audit --no-fund
npm run check
```

ติดตั้งสำเร็จ และ checker ส่ง HTTP requests เข้า Express app ผ่าน supertest ได้ครบ:

```text
ในห้อง (CP00–CP05)  23/23
ที่บ้าน (CP06–CP08)  2/2
Challenge            3/3
รวม                  28/28
```

ผล checker เป็น **pass** (exit code 0) ครอบคลุม root endpoint, GET รายการ/รายละเอียด, POST ที่ถูกและผิด, DELETE, 404 route, การกรองสถานะ และ PUT เปลี่ยนสถานะ มี logger พิมพ์ method, path และ status ใน output

## API ที่ตรวจ

| Method | Path | ผลที่สำคัญ |
|---|---|---|
| GET | `/` | 200 พร้อมข้อความ API |
| GET | `/api/requests` | 200 พร้อมรายการ; รองรับ `?status=pending` |
| GET | `/api/requests/:id` | 200 เมื่อพบ, 404 เมื่อไม่พบ |
| POST | `/api/requests` | 201 เมื่อข้อมูลถูกต้อง; 400 เมื่อข้อมูลไม่ครบหรือไม่ถูกต้อง |
| PUT | `/api/requests/:id` | 200 เมื่อเปลี่ยนสถานะ; 400 เมื่อสถานะไม่ถูกต้อง |
| DELETE | `/api/requests/:id` | 204 เมื่อลบ; 404 เมื่อไม่พบ |

## เปิด API ในเครื่อง

```sh
cd labs/week-06/lab06/starter
npm ci
npm start
```

ใช้ Postman collection ที่ `lab06/starter/evidence/Campus_Service_API.postman_collection.json` ทดสอบต่อได้ ตารางเดิมใน `lab06/starter/evidence/API_TEST.md` ยังเป็นแบบฟอร์มว่าง จึงใช้ผลตรวจอัตโนมัติข้างต้นเป็นหลักฐานของการเผยแพร่ครั้งนี้ ผล 28/28 เป็นขอบเขตที่ checker ตรวจ ไม่ได้ยืนยันการเก็บข้อมูลถาวรหลัง restart
