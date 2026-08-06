// src/components/FilterBar.jsx
function FilterBar({ value, onChange }) {
  return (
    <div className="filter-bar">
      <label htmlFor="status-filter">กรองสถานะ</label>
      <select
        id="status-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="all">ทั้งหมด</option>
        <option value="todo">todo</option>
        <option value="doing">doing</option>
        <option value="done">done</option>
      </select>
    </div>
  );
}
export default FilterBar;