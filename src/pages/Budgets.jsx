import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const defaultBudgets = [
  { category: 'Food', limit: 5000 },
  { category: 'Transport', limit: 2000 },
  { category: 'Shopping', limit: 3000 },
  { category: 'Bills', limit: 4000 },
];

export default function Budgets({ user }) {
  const [budgets, setBudgets] = useState(() => {
    const s = localStorage.getItem('budgets');
    return s ? JSON.parse(s) : defaultBudgets;
  });
  const [expenses, setExpenses] = useState([]);

  useEffect(() => { localStorage.setItem('budgets', JSON.stringify(budgets)); }, [budgets]);
  useEffect(() => { (async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/expenses`, { headers: { Authorization: `Bearer ${user.token}` } });
      setExpenses(data);
    } catch {}
  })(); }, [user?.token]);

  const totals = useMemo(() => budgets.map(b => ({
    ...b,
    spent: expenses.filter(e => e.category === b.category).reduce((s, e) => s + parseFloat(e.amount), 0)
  })), [budgets, expenses]);

  const addBudget = () => setBudgets([...budgets, { category: 'Other', limit: 1000 }]);

  return (
    <div>
      <h1>🎯 Budgets</h1>
      <p style={{color:'var(--muted)'}}>Set monthly limits and track progress by category</p>
      <div className="cards" style={{marginTop: 16}}>
        {totals.map((b, i) => {
          const pct = Math.min(100, Math.round((b.spent / (b.limit||1)) * 100));
          const over = b.spent > b.limit;
          return (
            <div key={i} className="card glass">
              <div style={{display:'flex', justifyContent:'space-between', marginBottom:10}}>
                <strong>{b.category}</strong>
                <span className="pill">Limit: {user.currency} {b.limit}</span>
              </div>
              <div style={{height:10, background:'#1a1f45', borderRadius:8, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)'}}>
                <div style={{width:`${pct}%`, height:'100%', background: over? 'linear-gradient(90deg, #ff5c8a, #ff9671)':'linear-gradient(90deg, var(--accent), var(--accent-2))'}} />
              </div>
              <div style={{display:'flex', justifyContent:'space-between', marginTop:8, fontSize:13, color:'var(--muted)'}}>
                <span>Spent: {user.currency} {b.spent.toFixed(2)}</span>
                <span>{pct}%</span>
              </div>
              <div style={{display:'flex', gap:8, marginTop:10}}>
                <input type="number" min="0" value={b.limit} onChange={e=>{
                  const v=[...budgets]; v[i]={...v[i], limit: Number(e.target.value)}; setBudgets(v);
                }} style={{flex:1, background:'#1a1f45', color:'var(--text)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'8px 10px'}} />
                <button className="btn secondary" onClick={()=>{ const v=[...budgets]; v.splice(i,1); setBudgets(v); }}>Remove</button>
              </div>
            </div>
          );
        })}
        <button className="btn" onClick={addBudget} style={{alignSelf:'start'}}>+ Add Budget</button>
      </div>
    </div>
  );
}
