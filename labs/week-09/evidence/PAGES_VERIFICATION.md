# LAB09 — Pages verification

ตรวจวันที่ **2026-10-21** ด้วย Node.js **v24.18.0** จาก branch `lab/week-09` ก่อนเพิ่มรายงาน (`2de67ca43e94efaf815aae3e4ec4cbed0a632834`)

งานที่ใช้เผยแพร่อยู่ใน `lab09/source/` ของ branch นี้ ประกอบด้วย SQLite database, schema, queries และ data model Pages แสดงรายงานและลิงก์ไฟล์ SQL/เอกสาร

## ผล checker ของฐานข้อมูลเดิม

คัดลอกไฟล์ใน `lab09/source/` ไปยังโฟลเดอร์ชั่วคราวแยก แล้วรัน:

```sh
node --disable-warning=ExperimentalWarning check-week09.mjs
```

ใช้สำเนาแยกเนื่องจาก checker มี INSERT/DELETE สำหรับตรวจ constraint จึงรักษา `campus.db` ที่ส่งไว้เดิมโดยไม่แก้ไข ผลจริง:

```text
ในห้อง (CP17–CP21)  9/11
ที่บ้าน (CP22–CP25) 15/16
Challenge           0/3
รวม                 24/30
```

สถานะเป็น **partial** แม้ checker คืน exit code 0 รายการที่ไม่ผ่าน:

- users ต้องมีอย่างน้อย 4 คน แต่ฐานข้อมูลเดิมมี 3 คน
- requests ต้องมีอย่างน้อย 8 รายการ แต่ฐานข้อมูลเดิมมี 6 รายการ
- พบคำร้องที่อ้างถึง users ที่ไม่มีอยู่ 3 รายการ
- ยังไม่มี Challenge: GROUP BY, aggregate function และ INDEX

## ตรวจ schema และ queries แยกจาก DB เดิม

ตรวจโดยรัน `schema.sql` ในฐานข้อมูล `:memory:` ใหม่ ไม่เขียนทับ `campus.db`:

```text
Schema seed: users=4, requests=8, foreignKeyViolations=0
Query 1: PASS; rows=8
Query 2: PASS; rows=3
Query 3: PASS; rows=3
Query 4: PASS; rows=2
Query 5: PASS; rows=8
Query 6: PASS; rows=4
Query 7: PASS; rows=4
Query 8: PASS; rows=3
NOT NULL: PASS (ปฏิเสธ users.name=NULL)
UNIQUE: PASS (ปฏิเสธ email ซ้ำ)
CHECK: PASS (ปฏิเสธ status='wrong-status')
PRIMARY KEY: PASS (ปฏิเสธ users.id=1 ซ้ำ)
FOREIGN KEY: PASS (ปฏิเสธ requester_id=999)
```

คำสั่ง Node ที่ใช้ตรวจจาก `lab09/source/` (ส่งโค้ดต่อไปนี้ให้ `node --disable-warning=ExperimentalWarning --input-type=module` ผ่าน stdin):

```js
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
const db = new DatabaseSync(':memory:');
db.exec(readFileSync('schema.sql', 'utf8'));
console.log('Schema seed:', JSON.stringify({
  users: db.prepare('SELECT COUNT(*) n FROM users').get().n,
  requests: db.prepare('SELECT COUNT(*) n FROM requests').get().n,
  foreignKeyViolations: db.prepare('PRAGMA foreign_key_check').all().length,
}));
const sql = readFileSync('queries.sql', 'utf8').replace(/--[^\n]*/g, '');
const queries = sql.split(';').map(s => s.trim()).filter(Boolean);
for (let i = 0; i < queries.length; i++) {
  console.log('Query ' + (i + 1) + ': PASS; rows=' + db.prepare(queries[i]).all().length);
}
const failures = [];
function reject(label, sql) {
  try {
    db.exec(sql);
    failures.push(label);
    console.log(label + ': FAIL (accepted invalid input)');
  } catch (error) {
    console.log(label + ': PASS (' + error.message + ')');
  }
}
reject('NOT NULL', "INSERT INTO users(name,department,email) VALUES(NULL,'test','not-null@test')");
reject('UNIQUE', "INSERT INTO users(name,department,email) VALUES('test','test','somchai@example.com')");
reject('CHECK', "UPDATE requests SET status='wrong-status' WHERE id='REQ-001'");
reject('PRIMARY KEY', "INSERT INTO users(id,name,department,email) VALUES(1,'test','test','pk@test')");
reject('FOREIGN KEY', "UPDATE requests SET requester_id=999 WHERE id='REQ-001'");
if (failures.length) process.exitCode = 1;
db.close();
```

ผลชุดนี้เป็น **pass** และ process exit code 0 แสดงว่า schema สามารถสร้างข้อมูลตั้งต้นครบและ SQL ทั้ง 8 คำสั่งรันได้ ส่วนความไม่ครบของ DB ที่ commit ไว้เดิมยังคงรายงานตาม checker ข้างต้น
