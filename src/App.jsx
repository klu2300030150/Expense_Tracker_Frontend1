import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PieChartPage from './pages/PieChartPage';
import ActivityPage from './pages/ActivityPage';
import LeaderboardPage from './pages/LeaderboardPage';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Budgets from './pages/Budgets';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const [qaToggle, setQaToggle] = useState(false); // just to trigger modal open from topbar if needed later

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <div className="app-layout">
        {user && <Sidebar user={user} onLogout={handleLogout} />}
        {user && <Topbar user={user} theme={theme} setTheme={setTheme} onQuickAdd={()=>setQaToggle(v=>!v)} />}
        <main className="main-content">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup setUser={setUser} />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} setUser={setUser} qaTrigger={qaToggle} /> : <Navigate to="/login" />} />
            <Route path="/piechart" element={user ? <PieChartPage user={user} /> : <Navigate to="/login" />} />
            <Route path="/activity" element={user ? <ActivityPage user={user} /> : <Navigate to="/login" />} />
            <Route path="/leaderboard" element={user ? <LeaderboardPage user={user} /> : <Navigate to="/login" />} />
            <Route path="/budgets" element={user ? <Budgets user={user} /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
