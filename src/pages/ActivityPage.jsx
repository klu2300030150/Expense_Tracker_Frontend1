import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function ActivityPage({ user }) {
  const [expenses, setExpenses] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/expenses`, { headers: { Authorization: `Bearer ${user.token}` } });
        setExpenses(data);
      } catch {}
    })();
  }, [user?.token]);

  const sorted = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{maxWidth:600,margin:'0 auto',padding:'32px 0'}}>
      <h1>📜 Recent Activity</h1>
      <p style={{color:'var(--muted)'}}>Timeline of your latest expenses</p>
      <ul style={{listStyle:'none',padding:0}}>
        {sorted.map((e, idx) => (
          <li key={e.id} style={{marginBottom:18}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <span style={{fontSize:22}}>{e.category === 'Food' ? '🍔' : e.category === 'Transport' ? '🚗' : e.category === 'Shopping' ? '🛍️' : e.category === 'Bills' ? '💡' : e.category === 'Entertainment' ? '🎬' : e.category === 'Health' ? '💊' : '💸'}</span>
              <div>
                <strong>{e.category}</strong> — {e.description || 'No description'}
                <div style={{fontSize:13,color:'var(--muted)'}}>{new Date(e.date).toLocaleString()} | {user.currency} {parseFloat(e.amount).toFixed(2)}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
