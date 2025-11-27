// API Configuration
// Backend connects to Railway MySQL database
// Production: Render.com backend
// Local dev: http://localhost:5000

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://expense-tracker-frontend1-bh7z.onrender.com';

export default API_BASE_URL;
