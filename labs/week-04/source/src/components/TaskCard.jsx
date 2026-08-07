const STATUS_LABEL = { todo: 'ต้องทำ', doing: 'กำลังทำ', done: 'เสร็จแล้ว' };
const CATEGORY_LABEL = {
  reading: 'อ่าน/ทบทวน',
  coding: 'เขียนโค้ด',
  review: 'ตรวจและอธิบาย',
};

function TaskCard({ task, onDeleteTask }) {
  return (
    <article className="card task-card">
      <div className="card-top">
        <div className="badges">
          <span className={`badge badge-${task.status}`}>
            {STATUS_LABEL[task.status]}
          </span>
          {task.priority === 'high' && (
            <span className="badge badge-priority">สำคัญ</span>
          )}
        </div>
        <button
          type="button"
          className="btn-delete"
          onClick={() => onDeleteTask(task.id)}
        >
          ลบ
        </button>
      </div>
      <h3>{task.title}</h3>
      <p className="card-subtitle">
        {CATEGORY_LABEL[task.category] ?? task.category}
      </p>
    </article>
  );
}

export default TaskCard;