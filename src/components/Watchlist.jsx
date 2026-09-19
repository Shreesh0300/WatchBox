import TaskCard from './TaskCard';

export default function Watchlist({ tasks, onToggle, onDelete, onRate }) {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>My Watchlist</h1>
        <p>Your complete media collection</p>
      </header>

      <div className="glass task-list">
        <div style={{ display: 'flex', flexDirection: 'column', padding: '2rem' }}>
          {tasks.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No media in your watchlist yet.</p>
          ) : (
            <div className="grouped-tasks">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onRate={onRate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
