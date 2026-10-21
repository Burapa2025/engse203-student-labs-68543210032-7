import { isPagesDemo } from '../services/requestService.js';

function AboutPage() {
  return (
    <section data-testid="page-about">
      <div className="page-heading"><div><p className="eyebrow dark">ABOUT THE LAB</p><h1>เกี่ยวกับระบบ</h1></div></div>
      <article className="panel prose"><p>Campus Service Request เป็นกรณีศึกษาสำหรับเรียนรู้ React, Express API, CORS และการเปลี่ยนสถานะคำร้อง</p><h2>สถาปัตยกรรม</h2><p>Page เรียก Service Layer ผ่าน apiClient เพื่อใช้งาน Express API</p>{isPagesDemo && <><h2>Pages Demo</h2><p>เวอร์ชันนี้ใช้ข้อมูลสาธิต 3 คำร้องและบันทึกการเปลี่ยนแปลงใน localStorage ของเบราว์เซอร์นี้ แยกจากแลบอื่น กด Reset Demo Data เพื่อคืนข้อมูลเริ่มต้น การรัน frontend ปกติยังเชื่อม Express API ตามเดิม</p></>}<h2>ความเป็นส่วนตัว</h2><p>ข้อมูลใน LAB เป็นข้อมูลสาธิต ห้ามบันทึกข้อมูลส่วนบุคคลจริง รหัสผ่าน token หรือ secret</p></article>
    </section>
  );
}

export default AboutPage;
