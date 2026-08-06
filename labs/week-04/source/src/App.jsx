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

  function handleAddTask(newTask) {
    setTasks((currentTasks) => [newTask, ...currentTasks]);
  }

  function handleDeleteTask(id) {
    setTasks((currentTasks) => currentTasks.filter((t) => t.id !== id));
  }

  return (
    <>
      <AppHeader />
      <main className="container page-content">
        <SummaryPanel taskCount={tasks.length} />
        <TaskForm onAddTask={handleAddTask} />
        <FilterBar value={statusFilter} onChange={setStatusFilter} />
        <TaskList tasks={filteredTasks} onDeleteTask={handleDeleteTask} />
      </main>
    </>
  );
}

export default App;