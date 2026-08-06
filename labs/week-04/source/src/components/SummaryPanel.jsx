function SummaryPanel({ summary }) {
  const stats = [
    { key: 'total', label: 'ทั้งหมด', value: summary.total },
    { key: 'todo', label: 'ต้องทำ', value: summary.todo },
    { key: 'doing', label: 'กำลังทำ', value: summary.doing },
    { key: 'done', label: 'เสร็จแล้ว', value: summary.done },
  ];

  return (
    <div className="stats-bar">
      {stats.map((s) => (
        <div className="stat-card" key={s.key}>
          <span className="stat-label">{s.label}</span>
          <span className="stat-value">{s.value}</span>
        </div>
      ))}
    </div>
  );
}

export default SummaryPanel;