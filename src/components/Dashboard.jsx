import StatCard from './StatCard';
import AddTask from './AddTask';

export default function Dashboard({ tasks, onAddTask }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Overview & Add New Media</p>
      </header>

      <section className="stats-container">
        <StatCard title="Total Media" value={total} />
        <StatCard title="Completed" value={completed} />
        <StatCard title="Pending" value={pending} />
      </section>

      <section className="main-content" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="glass add-task-form" style={{ width: '100%', maxWidth: '700px' }}>
          <AddTask onAddTask={onAddTask} />
        </div>
      </section>
    </main>
  );
}

