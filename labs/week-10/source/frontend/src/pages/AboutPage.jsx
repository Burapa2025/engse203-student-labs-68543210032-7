import { IS_PAGES_DEMO } from '../services/requestService.js';

function AboutPage() {
  return (
    <section data-testid="page-about">
      <div className="page-heading"><div><p className="eyebrow dark">ABOUT THE LAB</p><h1>เกี่ยวกับระบบ</h1></div></div>
      <article className="panel prose"><p>Campus Service Request — LAB 10 เชื่อม React กับ Express API และฐานข้อมูล SQLite</p><h2>สถาปัตยกรรม</h2><p>{IS_PAGES_DEMO ? 'เวอร์ชัน GitHub Pages ใช้ข้อมูลสาธิต 10 รายการและเก็บการเปลี่ยนแปลงใน localStorage ของเบราว์เซอร์ เพื่อทดลองสร้างคำร้อง ดูรายละเอียด เปลี่ยนสถานะ และลบข้อมูลได้ โดยไม่มี Express หรือ SQLite ทำงานบน Pages' : 'Page เรียก Service Layer ผ่าน Express API ซึ่งอ่านและเขียนฐานข้อมูล SQLite บนเซิร์ฟเวอร์'}</p><h2>ข้อมูลตัวอย่าง</h2><p>ใช้ข้อมูลสมมติสำหรับทดลองระบบ ปุ่ม Reset Demo Data ในเวอร์ชัน Pages จะคืนข้อมูลเริ่มต้นเฉพาะแลบนี้</p></article>
    </section>
  );
}

export default AboutPage;
