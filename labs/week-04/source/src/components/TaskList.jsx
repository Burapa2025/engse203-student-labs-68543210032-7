// src/components/TaskList.jsx
import TaskCard from './TaskCard.jsx';

function TaskList({ tasks, onDeleteTask }) {
  if (tasks.length === 0) {
    return <p className="empty-state">ไม่มีรายการงานในตอนนี้</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDeleteTask={onDeleteTask} />
      ))}
    </div>
  );
}

export default TaskList;