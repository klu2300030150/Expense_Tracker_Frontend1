import { useEffect } from 'react';
import './QuickAddModal.css';

const categories = ['Food','Transport','Shopping','Bills','Entertainment','Health','Other'];

const QuickAddModal = ({ open, onClose, onSubmit, data, setData }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="qa-overlay" onClick={onClose}>
      <div className="qa-modal glass" onClick={e => e.stopPropagation()}>
        <h3>➕ Quick Add Expense</h3>
        <form onSubmit={onSubmit} className="qa-form">
          <input type="number" placeholder="Amount" value={data.amount}
                 onChange={(e) => setData({...data, amount: e.target.value})} required min="0" step="0.01" />
          <select value={data.category}
                  onChange={(e) => setData({...data, category: e.target.value})}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="text" placeholder="Description" value={data.description}
                 onChange={(e) => setData({...data, description: e.target.value})} />
          <input type="date" value={data.date}
                 onChange={(e) => setData({...data, date: e.target.value})} required />
          <div className="qa-actions">
            <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
            <button className="btn" type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddModal;
