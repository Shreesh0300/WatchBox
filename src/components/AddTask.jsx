import { useState } from 'react';

const GENRES = [
  "Action", "Comedy", "Drama", "Science Fiction (Sci-Fi)", 
  "Fantasy", "Horror", "Thriller / Suspense", "Romance", 
  "Mystery", "Documentary", "Animation"
];

export default function AddTask({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [status, setStatus] = useState('pending');
  const [type, setType] = useState('Movie');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || selectedGenres.length === 0) return;
    
    onAddTask({ 
      title, 
      value: selectedGenres.join(', '), 
      status,
      type 
    });
    setTitle('');
    setSelectedGenres([]);
    setStatus('pending');
    setType('Movie');
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2>Add New Media</h2>
      
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input 
          id="title"
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Genres</label>
        <div className="genres-grid">
          {GENRES.map(genre => (
            <label key={genre} className="genre-checkbox">
              <input 
                type="checkbox" 
                checked={selectedGenres.includes(genre)}
                onChange={() => handleGenreToggle(genre)}
              />
              <span>{genre}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Type</label>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.2rem' }}>
          <label className="radio-label">
            <input 
              type="radio" 
              name="type" 
              value="Movie" 
              checked={type === 'Movie'} 
              onChange={(e) => setType(e.target.value)} 
            />
            <span>Movie</span>
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              name="type" 
              value="Web Series" 
              checked={type === 'Web Series'} 
              onChange={(e) => setType(e.target.value)} 
            />
            <span>Web Series</span>
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="status">Initial Status</label>
        <select 
          id="status" 
          value={status} 
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <button type="submit" className="btn-submit" disabled={selectedGenres.length === 0}>Add to watchlist</button>
    </form>
  );
}
