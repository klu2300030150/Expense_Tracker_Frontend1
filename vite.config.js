import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use '/' for Docker, '/Expense_Tracker_Frontend1/' for GitHub Pages
const base = process.env.DOCKER_BUILD ? '/' : '/Expense_Tracker_Frontend1/';

export default defineConfig({
  plugins: [react()],
  base: base,
  server: {
    port: 5173
  }
});
