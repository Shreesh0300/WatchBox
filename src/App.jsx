import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Watchlist from './components/Watchlist';
import MediaDetail from './components/MediaDetail';
import Auth from './components/Auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/media`;

function App() {
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setTasks(data);
        })
        .catch(err => console.error(err));
    } else {
      localStorage.removeItem('token');
      setTasks([]);
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
  };

  const handleAddTask = (newTask) => {
    fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newTask)
    })
      .then(res => res.json())
      .then(saved => setTasks([...tasks, saved]))
      .catch(err => console.error(err));
  };

  const handleToggle = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const updatedStatus = task.status === 'pending' ? 'completed' : 'pending';
    
    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: updatedStatus })
    })
      .then(res => res.json())
      .then(updated => setTasks(tasks.map(t => t.id === id ? updated : t)))
      .catch(err => console.error(err));
  };

  const handleRate = (id, rating) => {
    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ rating })
    })
      .then(res => res.json())
      .then(updated => setTasks(tasks.map(t => t.id === id ? updated : t)))
      .catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => setTasks(tasks.filter(t => t.id !== id)))
      .catch(err => console.error(err));
  };

  if (!token) {
    return <Auth setToken={setToken} />;
  }

  return (
    <BrowserRouter>
      <Navigation onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Dashboard tasks={tasks} onAddTask={handleAddTask} />} />
        <Route path="/watchlist" element={<Watchlist tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} onRate={handleRate} />} />
        <Route path="/media/:id" element={<MediaDetail tasks={tasks} onRate={handleRate} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
