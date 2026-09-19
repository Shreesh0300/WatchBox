import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TaskCard({ task, onToggle, onDelete, onRate }) {
  const navigate = useNavigate();
  const [hoverRating, setHoverRating] = useState(0);

  const handleCardClick = () => {
    navigate(`/media/${task.id}`);
  };

  const handleAction = (e, action) => {
    e.stopPropagation();
    action();
  };

  const renderStars = () => {
    if (task.status !== 'completed') return null;
    
    return (
      <div 
        className="star-rating" 
        onMouseLeave={() => setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star}
            className={`star ${(hoverRating || task.rating) >= star ? 'filled' : ''}`}
            onClick={(e) => handleAction(e, () => onRate(task.id, star))}
            onMouseEnter={() => setHoverRating(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="task-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="task-info">
        <span className="task-title">
          {task.title}
          <span className="task-type-badge">{task.type}</span>
        </span>
        <span className="task-value">{task.value}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <span className={`task-status status-${task.status}`} style={{ margin: 0 }}>
            {task.status}
          </span>
          {renderStars()}
        </div>
      </div>
      <div className="task-actions">
        <button 
          className="btn-icon toggle-complete" 
          onClick={(e) => handleAction(e, () => onToggle(task.id))}
          title={task.status === 'pending' ? 'Mark Completed' : 'Mark Pending'}
        >
          {task.status === 'pending' ? '✓' : '↺'}
        </button>
        <button 
          className="btn-icon delete" 
          onClick={(e) => handleAction(e, () => onDelete(task.id))}
          title="Delete"
        >
          ✗
        </button>
      </div>
    </div>
  );
}
