import { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getCategoryColor } from '../utils/exportUtils';
import { getSubcategoryIcon } from '../utils/categories';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'];

export default function PieChartPage({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewMode, setViewMode] = useState('category'); // 'category' or 'subcategory'

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/expenses`, { headers: { Authorization: `Bearer ${user.token}` } });
        setExpenses(data);
      } catch {}
    })();
  }, [user?.token]);

  // Category data
  const categoryData = Object.values(
    expenses.reduce((acc, e) => {
      acc[e.category] = acc[e.category] || { name: e.category, value: 0, count: 0 };
      acc[e.category].value += parseFloat(e.amount);
      acc[e.category].count += 1;
      return acc;
    }, {})
  );

  // Subcategory data for selected category
  const getSubcategoryData = (category) => {
    return Object.values(
      expenses
        .filter(e => e.category === category)
        .reduce((acc, e) => {
          const subcat = e.subcategory || 'Uncategorized';
          acc[subcat] = acc[subcat] || { name: subcat, value: 0, count: 0 };
          acc[subcat].value += parseFloat(e.amount);
          acc[subcat].count += 1;
          return acc;
        }, {})
    ).sort((a, b) => b.value - a.value);
  };

  // All subcategories data
  const allSubcategoryData = Object.values(
    expenses.reduce((acc, e) => {
      const key = `${e.category} - ${e.subcategory || 'Other'}`;
      acc[key] = acc[key] || { name: key, category: e.category, subcategory: e.subcategory || 'Other', value: 0, count: 0 };
      acc[key].value += parseFloat(e.amount);
      acc[key].count += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  const totalAmount = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalAmount) * 100).toFixed(1);
      return (
        <div className="card shadow-sm" style={{padding: '12px', border: '1px solid #ddd'}}>
          <p className="fw-bold mb-1">{data.name}</p>
          <p className="mb-0 text-primary">{user.currency} {data.value.toFixed(2)}</p>
          <p className="mb-0 text-muted small">{percentage}% of total</p>
          <p className="mb-0 text-muted small">{data.count} transaction{data.count !== 1 ? 's' : ''}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h1>
          <i className="bi bi-pie-chart me-2"></i>
          Budget Analysis
        </h1>
        <p className="text-muted">Visualize your spending by category and subcategory</p>
      </div>

      {/* View Mode Toggle */}
      <div className="d-flex justify-content-center gap-2 mb-4">
        <button 
          className={`btn ${viewMode === 'category' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => { setViewMode('category'); setSelectedCategory(null); }}
        >
          <i className="bi bi-diagram-3 me-2"></i>
          By Category
        </button>
        <button 
          className={`btn ${viewMode === 'subcategory' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setViewMode('subcategory')}
        >
          <i className="bi bi-list-nested me-2"></i>
          By Subcategory
        </button>
      </div>

      {/* Category View */}
      {viewMode === 'category' && !selectedCategory && (
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-pie-chart me-2"></i>
                  Category Distribution
                </h5>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie 
                      data={categoryData} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={100}
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      onClick={(data) => setSelectedCategory(data.name)}
                      style={{cursor: 'pointer'}}
                    >
                      {categoryData.map((entry, idx) => (
                        <Cell key={entry.name} fill={getCategoryColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-muted small mt-2">
                  <i className="bi bi-info-circle me-1"></i>
                  Click on a slice to see subcategories
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-bar-chart me-2"></i>
                  Category Breakdown
                </h5>
                <div className="mt-3">
                  {categoryData.map((cat, idx) => {
                    const percentage = ((cat.value / totalAmount) * 100).toFixed(1);
                    return (
                      <div key={cat.name} className="mb-3" style={{cursor: 'pointer'}} onClick={() => setSelectedCategory(cat.name)}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold">{cat.name}</span>
                          <span className="badge" style={{backgroundColor: getCategoryColor(cat.name)}}>
                            {user.currency} {cat.value.toFixed(2)}
                          </span>
                        </div>
                        <div className="progress" style={{height: '25px'}}>
                          <div 
                            className="progress-bar" 
                            style={{width: `${percentage}%`, backgroundColor: getCategoryColor(cat.name)}}
                          >
                            {percentage}%
                          </div>
                        </div>
                        <small className="text-muted">{cat.count} transaction{cat.count !== 1 ? 's' : ''}</small>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 p-3 bg-light rounded">
                  <div className="d-flex justify-content-between">
                    <strong>Total Expenses:</strong>
                    <strong className="text-primary">{user.currency} {totalAmount.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subcategory View for Selected Category */}
      {viewMode === 'category' && selectedCategory && (
        <div>
          <button className="btn btn-outline-secondary mb-3" onClick={() => setSelectedCategory(null)}>
            <i className="bi bi-arrow-left me-2"></i>
            Back to Categories
          </button>
          
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="card shadow">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className={`bi ${getSubcategoryIcon(selectedCategory, '')} me-2`}></i>
                    {selectedCategory} - Subcategories
                  </h5>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie 
                        data={getSubcategoryData(selectedCategory)} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={100}
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {getSubcategoryData(selectedCategory).map((entry, idx) => (
                          <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="card shadow">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-list-ul me-2"></i>
                    Subcategory Details
                  </h5>
                  <div className="mt-3">
                    {getSubcategoryData(selectedCategory).map((subcat, idx) => {
                      const categoryTotal = categoryData.find(c => c.name === selectedCategory)?.value || 1;
                      const percentage = ((subcat.value / categoryTotal) * 100).toFixed(1);
                      return (
                        <div key={subcat.name} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span>
                              <i className={`bi ${getSubcategoryIcon(selectedCategory, subcat.name)} me-2`}></i>
                              {subcat.name}
                            </span>
                            <span className="badge bg-secondary">
                              {user.currency} {subcat.value.toFixed(2)}
                            </span>
                          </div>
                          <div className="progress" style={{height: '20px'}}>
                            <div 
                              className="progress-bar" 
                              style={{width: `${percentage}%`, backgroundColor: COLORS[idx % COLORS.length]}}
                            >
                              {percentage}%
                            </div>
                          </div>
                          <small className="text-muted">{subcat.count} transaction{subcat.count !== 1 ? 's' : ''}</small>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Subcategories View */}
      {viewMode === 'subcategory' && (
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-bar-chart-fill me-2"></i>
                  All Subcategories
                </h5>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={allSubcategoryData.slice(0, 15)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#667eea">
                      {allSubcategoryData.slice(0, 15).map((entry, idx) => (
                        <Cell key={entry.name} fill={getCategoryColor(entry.category)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-table me-2"></i>
                  Top Spending by Subcategory
                </h5>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Amount</th>
                        <th>Transactions</th>
                        <th>% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allSubcategoryData.slice(0, 20).map((item, idx) => {
                        const percentage = ((item.value / totalAmount) * 100).toFixed(1);
                        return (
                          <tr key={item.name}>
                            <td>{idx + 1}</td>
                            <td>
                              <span 
                                className="badge" 
                                style={{backgroundColor: getCategoryColor(item.category)}}
                              >
                                {item.category}
                              </span>
                            </td>
                            <td>
                              <i className={`bi ${getSubcategoryIcon(item.category, item.subcategory)} me-2`}></i>
                              {item.subcategory}
                            </td>
                            <td className="fw-bold">{user.currency} {item.value.toFixed(2)}</td>
                            <td>{item.count}</td>
                            <td>
                              <div className="progress" style={{height: '20px', width: '80px'}}>
                                <div 
                                  className="progress-bar" 
                                  style={{width: `${percentage}%`, backgroundColor: getCategoryColor(item.category)}}
                                >
                                  {percentage}%
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
