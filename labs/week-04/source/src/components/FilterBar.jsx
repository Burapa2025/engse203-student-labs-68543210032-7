const FILTERS = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'todo', label: 'ต้องทำ' },
  { value: 'doing', label: 'กำลังทำ' },
  { value: 'done', label: 'เสร็จแล้ว' },
];

function FilterBar({ value, onChange }) {
  return (
    <div className="filter-tabs" role="tablist" aria-label="กรองสถานะงาน">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          role="tab"
          aria-selected={value === f.value}
          className={value === f.value ? 'tab active' : 'tab'}
          onClick={() => onChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;