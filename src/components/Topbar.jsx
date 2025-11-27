import { useEffect } from 'react';
import './Topbar.css';

const Topbar = ({ user, onQuickAdd, theme, setTheme }) => {
  useEffect(() => {
    document.body.classList.remove('theme-light');
    if (theme === 'light') document.body.classList.add('theme-light');
  }, [theme]);

  return (
    <header className="topbar glass">
      <div className="brand">
        <i className="bi bi-wallet2 me-2" style={{fontSize: 24}}></i>
        <span className="fw-bold">Expense Tracker</span>
      </div>
      <div className="search d-flex gap-2 align-items-center">
        <div className="input-group" style={{maxWidth: '300px'}}>
          <span className="input-group-text bg-transparent">
            <i className="bi bi-search"></i>
          </span>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search expenses..." 
            aria-label="search" 
          />
        </div>
        <button 
          className="btn btn-outline-secondary" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon-stars'}`}></i>
        </button>
        <button className="btn btn-primary" onClick={onQuickAdd}>
          <i className="bi bi-lightning-charge me-1"></i> Quick Add
        </button>
      </div>
      <div className="profile d-flex align-items-center gap-3">
        <span className="badge bg-primary">{user?.currency || 'INR'}</span>
        <div className="d-flex align-items-center gap-2">
          <div 
            className="avatar bg-gradient" 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '18px'
            }}
          >
            {user?.fullName?.[0]?.toUpperCase() || 'G'}
          </div>
          <div className="d-none d-lg-block">
            <div className="fw-bold">{user?.fullName || 'Guest'}</div>
            <small className="text-muted">{user?.email}</small>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
