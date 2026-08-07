export default function SummaryPanel({ requests }) {
  const total = requests.length;
  const pending = requests.filter(r => r.status === 'pending').length;
  const inProgress = requests.filter(r => r.status === 'in-progress').length;
  const completed = requests.filter(r => r.status === 'completed').length;
  const urgent = requests.filter(r => r.priority === 'urgent').length;

  return (
    <section className="summary-panel" aria-label="สรุปภาพรวมคำร้อง">
      <h2>สรุปภาพรวมคำร้อง</h2>
      <div className="summary-grid">
        <div className="summary-card">
          <span className="count">{total}</span>
          <span className="label">ทั้งหมด</span>
        </div>
        <div className="summary-card pending">
          <span className="count">{pending}</span>
          <span className="label">รอดำเนินการ</span>
        </div>
        <div className="summary-card in-progress">
          <span className="count">{inProgress}</span>
          <span className="label">กำลังดำเนินการ</span>
        </div>
        <div className="summary-card completed">
          <span className="count">{completed}</span>
          <span className="label">เสร็จสิ้น</span>
        </div>
        <div className="summary-card urgent">
          <span className="count">{urgent}</span>
          <span className="label">ด่วนที่สุด</span>
        </div>
      </div>
    </section>
  );
}