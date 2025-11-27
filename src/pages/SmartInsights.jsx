import { useEffect, useState } from 'react';
import API_BASE_URL from '../config';
import './SmartInsights.css';

const SmartInsights = ({ user }) => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI-powered tips (replace with backend call for real insights)
    setTimeout(() => {
      setTips([
        'You spent most on Food last month. Try setting a budget for dining out.',
        'Your subscription expenses increased by 20%. Consider reviewing unused services.',
        'You saved ₹500 by reducing transport costs. Keep it up!',
        'Set a savings goal to track your progress.',
        'Try the Quick Add button for faster expense entry!'
      ]);
      setLoading(false);
    }, 1200);
  }, []);

  return (
    <div className="insights-container">
      <h1>📊 Smart Insights</h1>
      <p>Personalized tips and trends based on your expenses</p>
      {loading ? (
        <div style={{marginTop: '32px', textAlign: 'center'}}>
          <div className="spinner" style={{marginBottom: '12px'}}></div>
          <div>Loading insights...</div>
        </div>
      ) : (
        <ul className="insights-list">
          {tips.map((tip, idx) => <li key={idx}>{tip}</li>)}
        </ul>
      )}
    </div>
  );
};

export default SmartInsights;
