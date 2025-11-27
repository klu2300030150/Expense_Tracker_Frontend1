import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import API_BASE_URL from '../config';
import './Dashboard.css';
import QuickAddModal from '../components/QuickAddModal';
import { exportToCSV, exportToPDF, getCategoryIcon, getCategoryColor } from '../utils/exportUtils';
import { CATEGORIES_WITH_SUBCATEGORIES, getSubcategories, getSubcategoryIcon, getAllCategories } from '../utils/categories';

const Dashboard = ({ user, setUser, qaTrigger }) => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'Food',
    subcategory: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = getAllCategories();
  const [filter, setFilter] = useState({ category: 'All', month: 'All', subcategory: 'All' });
  const [qaOpen, setQaOpen] = useState(false);
  const [selectedCategorySubcategories, setSelectedCategorySubcategories] = useState(getSubcategories('Food'));

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    if (qaTrigger !== undefined) setQaOpen(true);
  }, [qaTrigger]);

  const loadExpenses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/expenses`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      setExpenses(response.data);
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`${API_BASE_URL}/api/expenses`, newExpense, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      toast.success('✅ Expense added successfully!');
      
      setNewExpense({
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      loadExpenses();
    } catch (error) {
      toast.error('❌ Failed to add expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await axios.delete(`${API_BASE_URL}/api/expenses/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        toast.success('🗑️ Expense deleted successfully!');
        loadExpenses();
      } catch (error) {
        toast.error('❌ Failed to delete expense');
      }
    }
  };

  const handleExportCSV = () => {
    exportToCSV(filtered, user);
    toast.success('📄 CSV exported successfully!');
  };

  const handleExportPDF = () => {
    exportToPDF(filtered, user);
    toast.success('📑 PDF exported successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const months = useMemo(() => {
    const s = new Set();
    expenses.forEach(e => s.add(new Date(e.date).toISOString().slice(0,7)));
    return ['All', ...Array.from(s).sort().reverse()];
  }, [expenses]);

  const filtered = useMemo(() => expenses.filter(e =>
    (filter.category === 'All' || e.category === filter.category) &&
    (filter.subcategory === 'All' || e.subcategory === filter.subcategory) &&
    (filter.month === 'All' || new Date(e.date).toISOString().slice(0,7) === filter.month)
  ), [expenses, filter]);

  const totalExpenses = filtered.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

  const categoryTotals = categories.map(cat => ({
    category: cat,
    total: filtered
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0)
  }));

  return (
    <div className="dashboard">
      <ToastContainer />
      <div className="content">
        <div className="summary-card glass card">
          <h2>Total Expenses</h2>
          <p className="total">{user.currency} {totalExpenses.toFixed(2)}</p>
        </div>

        <div className="add-expense-card glass card">
          <h3>
            <i className="bi bi-plus-circle me-2"></i>
            Add New Expense
          </h3>
          <form onSubmit={handleAddExpense}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <i className="bi bi-cash me-1"></i> Amount *
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  required
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <i className="bi bi-tag me-1"></i> Category *
                </label>
                <select
                  className="form-select"
                  value={newExpense.category}
                  onChange={(e) => {
                    const newCategory = e.target.value;
                    setNewExpense({ 
                      ...newExpense, 
                      category: newCategory,
                      subcategory: '' 
                    });
                    setSelectedCategorySubcategories(getSubcategories(newCategory));
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <i className="bi bi-list-ul me-1"></i> Subcategory *
                </label>
                <select
                  className="form-select"
                  value={newExpense.subcategory}
                  onChange={(e) => setNewExpense({ ...newExpense, subcategory: e.target.value })}
                  required
                >
                  <option value="">Select subcategory...</option>
                  {selectedCategorySubcategories.map(subcat => (
                    <option key={subcat.value} value={subcat.value}>
                      {subcat.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-bold">
                  <i className="bi bi-calendar3 me-1"></i> Date *
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  required
                />
              </div>
              
              <div className="col-12">
                <label className="form-label fw-bold">
                  <i className="bi bi-pencil me-1"></i> Description (Optional)
                </label>
                <textarea
                  className="form-control"
                  placeholder="Add a note about this expense..."
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  rows="2"
                />
              </div>
              
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">
                  <i className="bi bi-check-circle me-2"></i>
                  Add Expense
                </button>
              </div>
            </div>
          </form>
          <div style={{display:'flex', gap:10, marginTop:10, flexWrap: 'wrap'}}>
            <button className="btn btn-info" type="button" onClick={()=>setQaOpen(true)}>
              <i className="bi bi-lightning-charge me-1"></i> Quick Add
            </button>
            <button className="btn btn-success" type="button" onClick={handleExportCSV}>
              <i className="bi bi-file-earmark-spreadsheet me-1"></i> Export CSV
            </button>
            <button className="btn btn-danger" type="button" onClick={handleExportPDF}>
              <i className="bi bi-file-earmark-pdf me-1"></i> Export PDF
            </button>
          </div>
        </div>

        <div className="glass card" style={{borderRadius:15}}>
          <h3>
            <i className="bi bi-funnel me-2"></i>
            Filters
          </h3>
          <div className="row g-2 mt-2">
            <div className="col-md-4">
              <label className="form-label small fw-bold">Category</label>
              <select 
                className="form-select" 
                value={filter.category} 
                onChange={e => {
                  const newCategory = e.target.value;
                  setFilter(f => ({
                    ...f, 
                    category: newCategory,
                    subcategory: 'All'
                  }));
                }}
              >
                {['All', ...categories].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="col-md-4">
              <label className="form-label small fw-bold">Subcategory</label>
              <select 
                className="form-select" 
                value={filter.subcategory} 
                onChange={e => setFilter(f => ({...f, subcategory: e.target.value}))}
                disabled={filter.category === 'All'}
              >
                <option value="All">All Subcategories</option>
                {filter.category !== 'All' && getSubcategories(filter.category).map(sub => (
                  <option key={sub.value} value={sub.value}>{sub.label}</option>
                ))}
              </select>
            </div>
            
            <div className="col-md-4">
              <label className="form-label small fw-bold">Month</label>
              <select 
                className="form-select" 
                value={filter.month} 
                onChange={e => setFilter(f => ({...f, month: e.target.value}))}
              >
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            
            <div className="col-12">
              <button 
                className="btn btn-outline-secondary w-100" 
                type="button" 
                onClick={() => setFilter({category:'All', month:'All', subcategory:'All'})}
              >
                <i className="bi bi-arrow-counterclockwise me-1"></i>
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div className="category-breakdown glass card">
          <h3>📊 Category Breakdown</h3>
          {categoryTotals.filter(ct => ct.total > 0).map(ct => (
            <div key={ct.category} className="category-item">
              <span>{ct.category}</span>
              <span className="amount">{user.currency} {ct.total.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="expenses-list glass card">
          <h3>
            <i className="bi bi-journal-text me-2"></i>
            Recent Expenses ({filtered.length})
          </h3>
          {filtered.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-inbox" style={{fontSize: '3rem'}}></i>
              <p className="mt-3">No expenses yet. Add your first expense above!</p>
            </div>
          ) : (
            filtered.map(expense => (
              <div key={expense.id} className="expense-item">
                <div className="d-flex align-items-center gap-3 flex-grow-1">
                  <div 
                    className="icon-wrapper" 
                    style={{
                      backgroundColor: getCategoryColor(expense.category) + '20',
                      color: getCategoryColor(expense.category),
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}
                  >
                    <i className={`bi ${getSubcategoryIcon(expense.category, expense.subcategory)}`}></i>
                  </div>
                  <div className="expense-info flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">
                          {expense.subcategory || expense.description || 'No description'}
                        </h6>
                        {expense.description && expense.subcategory && (
                          <p className="text-muted small mb-1">{expense.description}</p>
                        )}
                        <div className="d-flex gap-2 align-items-center flex-wrap">
                          <span 
                            className="badge" 
                            style={{backgroundColor: getCategoryColor(expense.category)}}
                          >
                            <i className={`bi ${getCategoryIcon(expense.category)} me-1`}></i>
                            {expense.category}
                          </span>
                          {expense.subcategory && (
                            <span 
                              className="badge bg-secondary"
                            >
                              <i className={`bi ${getSubcategoryIcon(expense.category, expense.subcategory)} me-1`}></i>
                              {expense.subcategory}
                            </span>
                          )}
                          <small className="text-muted">
                            <i className="bi bi-calendar3 me-1"></i>
                            {new Date(expense.date).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold" style={{fontSize: '1.1rem', color: getCategoryColor(expense.category)}}>
                          {user.currency} {parseFloat(expense.amount).toFixed(2)}
                        </div>
                        <button 
                          onClick={() => handleDeleteExpense(expense.id)} 
                          className="btn btn-sm btn-outline-danger mt-1"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <QuickAddModal open={qaOpen} onClose={()=>setQaOpen(false)} onSubmit={handleAddExpense}
        data={newExpense} setData={setNewExpense} />
    </div>
  );
};

export default Dashboard;
