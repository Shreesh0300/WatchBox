import { NavLink } from 'react-router-dom';

export default function Navigation({ onLogout }) {
  return (
    <nav className="navbar glass">
      <div className="nav-brand">WatchBox</div>
      <div className="nav-links">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          end
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/watchlist" 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          My Watchlist
        </NavLink>
        <button 
          onClick={onLogout} 
          className="nav-link" 
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
