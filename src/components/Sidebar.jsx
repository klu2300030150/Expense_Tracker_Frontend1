import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ user, onLogout }) => (
  <nav className="sidebar">
    <div className="logo">
      <i className="bi bi-wallet2 me-2"></i>
      <span className="fw-bold">Expense Tracker</span>
    </div>
    <ul>
      <li>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="bi bi-house-door me-2"></i> Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink to="/piechart" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="bi bi-pie-chart me-2"></i> Budget Pie Chart
        </NavLink>
      </li>
      <li>
        <NavLink to="/activity" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="bi bi-activity me-2"></i> Recent Activity
        </NavLink>
      </li>
      <li>
        <NavLink to="/leaderboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="bi bi-trophy me-2"></i> Top Categories
        </NavLink>
      </li>
      <li>
        <NavLink to="/budgets" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="bi bi-bullseye me-2"></i> Budgets
        </NavLink>
      </li>
      <li>
        <NavLink to="/insights" className={({ isActive }) => isActive ? 'active' : ''}>
          <i className="bi bi-graph-up-arrow me-2"></i> Smart Insights
        </NavLink>
      </li>
      <li>
        <a onClick={onLogout} className="text-danger" style={{cursor: 'pointer'}}>
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </a>
      </li>
    </ul>
    {user && (
      <div className="sidebar-user p-3 mt-auto">
        <div className="d-flex align-items-center gap-2">
          <div 
            className="avatar-small" 
            style={{
              width: '35px',
              height: '35px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {user.fullName?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="fw-bold small">{user.fullName}</div>
            <small className="text-muted" style={{fontSize: '0.7rem'}}>{user.email}</small>
          </div>
        </div>
      </div>
    )}
  </nav>
);

export default Sidebar;
