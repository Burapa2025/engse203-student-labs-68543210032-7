# API Test Evidence — LAB07

## Test Results

### `npm test` output (api/)

All 6 test cases passed:

| Suite | Test | Result |
|---|---|---|
| GET /api/requests | คืนรายการทั้งหมด พร้อม status 200 | ✅ PASS |
| GET /api/requests/:id | พบคำร้อง จะคืน 200 พร้อมข้อมูล | ✅ PASS |
| GET /api/requests/:id | ไม่พบคำร้อง จะคืน 404 | ✅ PASS |
| POST /api/requests | ส่งข้อมูลถูกต้อง จะคืน 201 พร้อมข้อมูล | ✅ PASS |
| POST /api/requests | ข้อมูลไม่ครบ จะคืน 400 | ✅ PASS |
| CORS header | ส่ง origin ที่อนุญาต จะคืน 200 | ✅ PASS |

**สรุป: 6/6 test cases ผ่านทั้งหมด**

### `node check-week07.mjs` output

```
🏫 ในห้อง (CP09–CP12)   ผ่าน 24/25 รายการ
🏠 ที่บ้าน (CP13–CP16)   ผ่าน 8/8 รายการ
⭐ Challenge            ผ่าน 3/3 รายการ
──────────────────────────────────────────────────────────
ผ่าน 35/36 รายการ
```

## Screenshots

- `images/network-cors-ok.png` — DevTools Network แสดง header Access-Control-Allow-Origin
- `images/app-with-api.png` — หน้า Dashboard แสดงข้อมูลจาก API
- `images/error-state.png` — ปิด API แล้วแอปแสดงข้อความแจ้งผู้ใช้
