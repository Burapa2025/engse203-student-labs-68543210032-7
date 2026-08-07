import { useState } from 'react';
import { initialTasks } from './data/initialTasks.js';
import AppHeader from './components/AppHeader.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import FilterBar from './components/FilterBar.jsx';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = statusFilter === 'all'
    ? tasks
    : tasks.filter((t) => t.status === statusFilter);

  const summary = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    doing: tasks.filter((t) => t.status === 'doing').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  function handleAddTask(newTask) {
    setTasks((currentTasks) => [newTask, ...currentTasks]);
  }

  function handleDeleteTask(id) {
    setTasks((currentTasks) => currentTasks.filter((t) => t.id !== id));
  }

  return (
    <>
      <AppHeader
        title="Study Task Board"
        subtitle="ฝึก React mental model ก่อนประยุกต์กับ Campus Service Request"
      />
      <main className="container page-content">
        <SummaryPanel summary={summary} />

        <div className="board-layout">
          <aside>
            <TaskForm onAddTask={handleAddTask} />
          </aside>

          <section>
            <div className="tasks-header">
              <div>
                <p className="eyebrow">TASKS</p>
                <h2>รายการฝึกของฉัน</h2>
              </div>
              <FilterBar value={statusFilter} onChange={setStatusFilter} />
            </div>
            <TaskList tasks={filteredTasks} onDeleteTask={handleDeleteTask} />
          </section>
        </div>
      </main>
    </>
  );
}

export default App;