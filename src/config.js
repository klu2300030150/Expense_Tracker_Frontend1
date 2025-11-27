// API Configuration
// For local development: http://localhost:8081
// For production: Your Render backend URL
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://expense-tracker-backend-bfmw.onrender.com' // Live Render backend ✅
  : 'http://localhost:8081';

export default API_BASE_URL;
