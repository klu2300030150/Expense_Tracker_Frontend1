import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Expense_Tracker_Frontend1/',
  server: {
    port: 5173
  }
});
