function TaskCard({ task, onDeleteTask }) {
  return (
    <article className="card">
      <h3>{task.title}</h3>
      <p>หมวด: {task.category}</p>
      <p>ความสำคัญ: {task.priority}</p>
      <p>สถานะ: {task.status}</p>
      <button type="button" onClick={() => onDeleteTask(task.id)}>
        ลบ
      </button>
    </article>
  );
}

export default TaskCard;