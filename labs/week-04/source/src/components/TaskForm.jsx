import { useState } from 'react';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('normal');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    if (title.trim().length < 3) {
      setError('ชื่องานต้องมีอย่างน้อย 3 ตัวอักษร');
      return;
    }
    if (!category) {
      setError('กรุณาเลือกหมวดหมู่');
      return;
    }

    const newTask = {
      id: `TASK-${Date.now()}`,
      title: title.trim(),
      category,
      priority,
      status: 'todo',
    };

    onAddTask(newTask);

    // reset form เฉพาะตอน valid เท่านั้น
    setTitle('');
    setCategory('');
    setPriority('normal');
    setError('');
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="title">ชื่องาน</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={!!error}
        />
      </div>

      <div className="field">
        <label htmlFor="category">หมวดหมู่</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-invalid={!!error}
        >
          <option value="">-- เลือก --</option>
          <option value="reading">reading</option>
          <option value="coding">coding</option>
          <option value="review">review</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="priority">ความสำคัญ</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="normal">normal</option>
          <option value="high">high</option>
        </select>
      </div>

      {error && <p className="error" role="status">{error}</p>}

      <button type="submit">เพิ่มงาน</button>
    </form>
  );
}

export default TaskForm;