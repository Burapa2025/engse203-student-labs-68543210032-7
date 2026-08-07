import { useState } from 'react';
import AppHeader from './components/AppHeader';
import SummaryPanel from './components/SummaryPanel';
import RequestForm from './components/RequestForm';
import FilterBar from './components/FilterBar';
import RequestList from './components/RequestList';
import { initialRequests } from './data/initialRequests';
import './styles.css';

export default function App() {
  const [requests, setRequests] = useState(initialRequests);
  const [filter, setFilter] = useState('all');

  const handleAddRequest = (newRequest) => {
    setRequests(prev => [newRequest, ...prev]);
  };

  const handleDeleteRequest = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  return (
    <div className="app">
      <AppHeader />
      <main className="container page-grid">
        <div className="left-column">
          <RequestForm onAddRequest={handleAddRequest} />
        </div>
        <div className="right-column">
          <SummaryPanel requests={requests} />
          <div className="panel list-panel">
            <FilterBar currentFilter={filter} onFilterChange={setFilter} />
            <RequestList requests={filteredRequests} onDelete={handleDeleteRequest} />
          </div>
        </div>
      </main>
    </div>
  );
}