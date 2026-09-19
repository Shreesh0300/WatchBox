import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function MediaDetail({ tasks, onRate }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hoverRating, setHoverRating] = useState(0);
  
  const media = tasks.find(t => t.id === id);

  if (!media) {
    return (
      <main className="dashboard">
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2>Media not found!</h2>
          <button className="btn-submit" onClick={() => navigate('/watchlist')} style={{ marginTop: '1rem' }}>
            Back to Watchlist
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <div className="glass" style={{ padding: '4rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', wordBreak: 'break-word' }}>
          {media.title}
        </h1>
        <span className="task-type-badge" style={{ fontSize: '1rem', padding: '0.4rem 1rem', marginLeft: '0' }}>
          {media.type}
        </span>
        <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginTop: '1.5rem' }}>
          Genres: <span style={{ color: 'var(--text-main)' }}>{media.value}</span>
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className={`task-status status-${media.status}`} style={{ fontSize: '1.2rem', padding: '0.5rem 1.5rem', marginBottom: '1rem' }}>
            {media.status}
          </span>
          {media.status === 'completed' && (
            <div 
              className="star-rating" 
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star}
                  className={`star ${(hoverRating || media.rating) >= star ? 'filled' : ''}`}
                  onClick={() => onRate(media.id, star)}
                  onMouseEnter={() => setHoverRating(star)}
                  style={{ fontSize: '2rem' }}
                >
                  ★
                </span>
              ))}
            </div>
          )}
        </div>
        <button className="btn-submit" onClick={() => navigate('/watchlist')} style={{ marginTop: '3rem', padding: '0.8rem 2rem' }}>
          Back to Watchlist
        </button>
      </div>
    </main>
  );
}
