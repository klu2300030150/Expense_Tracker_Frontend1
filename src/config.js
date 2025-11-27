// API Configuration
// Backend connects to Railway MySQL database
// Run: npm run server (to start backend on port 5000)
// Run: npm run dev (to start frontend)
// Or: npm start (to run both)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_BASE_URL;
