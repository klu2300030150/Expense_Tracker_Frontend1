import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function LeaderboardPage({ user }) {
  const [expenses, setExpenses] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/expenses`, { headers: { Authorization: `Bearer ${user.token}` } });
        setExpenses(data);
      } catch {}
    })();
  }, [user?.token]);

  const leaderboard = Object.values(
    expenses.reduce((acc, e) => {
      acc[e.category] = acc[e.category] || { category: e.category, total: 0, count: 0 };
      acc[e.category].total += parseFloat(e.amount);
      acc[e.category].count += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.total - a.total);

  return (
    <div style={{maxWidth:600,margin:'0 auto',padding:'32px 0'}}>
      <h1>🏆 Top Categories</h1>
      <p style={{color:'var(--muted)'}}>Your most spent categories</p>
      <table style={{width:'100%',borderCollapse:'collapse',marginTop:18}}>
        <thead>
          <tr style={{background:'var(--card-bg)',color:'var(--text)'}}>
            <th style={{textAlign:'left',padding:'8px'}}>Category</th>
            <th style={{textAlign:'right',padding:'8px'}}>Total Spent</th>
            <th style={{textAlign:'right',padding:'8px'}}>Entries</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((row, idx) => (
            <tr key={row.category} style={{background:idx%2?'#1a1f45':'transparent'}}>
              <td style={{padding:'8px'}}>{row.category}</td>
              <td style={{padding:'8px',textAlign:'right'}}>{user.currency} {row.total.toFixed(2)}</td>
              <td style={{padding:'8px',textAlign:'right'}}>{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
