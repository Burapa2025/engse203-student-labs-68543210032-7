import { useState } from 'react';

const initialFormData = { title: '', category: '', priority: 'normal' };

function TaskForm({ onAddTask }) {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (formData.title.trim().length < 3) {
      setError('ชื่องานต้องมีอย่างน้อย 3 ตัวอักษร');
      return;
    }
    if (!formData.category) {
      setError('กรุณาเลือกประเภท');
      return;
    }

    const newTask = {
      id: `TASK-${Date.now()}`,
      title: formData.title.trim(),
      category: formData.category,
      priority: formData.priority,
      status: 'todo',
    };

    onAddTask(newTask);
    setFormData(initialFormData);
    setError('');
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <p className="eyebrow">CONTROLLED FORM</p>
      <h2>เพิ่มงานฝึก</h2>

      <div className="field">
        <label htmlFor="title">ชื่องาน</label>
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          aria-invalid={!!error}
        />
      </div>

      <div className="field">
        <label htmlFor="category">ประเภท</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          aria-invalid={!!error}
        >
          <option value="">-- เลือกประเภท --</option>
          <option value="reading">อ่าน/ทบทวน</option>
          <option value="coding">เขียนโค้ด</option>
          <option value="review">ตรวจและอธิบาย</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="priority">ความสำคัญ</label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="normal">ปกติ</option>
          <option value="high">สูง</option>
        </select>
      </div>

      {error && (
        <p className="error" role="status">
          {error}
        </p>
      )}

      <button type="submit">เพิ่มงาน</button>
    </form>
  );
}

export default TaskForm;