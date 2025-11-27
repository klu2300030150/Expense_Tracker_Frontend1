import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB connection on startup
pool.getConnection()
  .then(conn => {
    console.log('✅ Connected to Railway MySQL database');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

// Helper: Generate simple token
function generateToken(userId) {
  return Buffer.from(`${userId}-${Date.now()}-${Math.random().toString(36)}`).toString('base64');
}

// ========================
// AUTH ROUTES
// ========================

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, currency } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required' });
    }

    // Check if user exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      `INSERT INTO users (username, email, password, phone_number, currency) VALUES (?, ?, ?, ?, ?)`,
      [fullName, email, hashedPassword, phoneNumber || null, currency || 'USD']
    );

    const userId = result.insertId;
    const token = generateToken(userId);

    // Log activity
    await pool.query(
      `INSERT INTO activity_log (user_id, action, entity_type, details) VALUES (?, ?, ?, ?)`,
      [userId, 'signup', 'user', JSON.stringify({ email })]
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      userId,
      fullName,
      email,
      currency: currency || 'USD'
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user.id);

    // Log activity
    await pool.query(
      `INSERT INTO activity_log (user_id, action, entity_type) VALUES (?, ?, ?)`,
      [user.id, 'login', 'user']
    );

    res.json({
      message: 'Login successful',
      token,
      userId: user.id,
      fullName: user.username,
      email: user.email,
      currency: user.currency || 'USD'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ========================
// EXPENSE ROUTES
// ========================

// Get all expenses for a user
app.get('/api/expenses/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [expenses] = await pool.query(
      `SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, created_at DESC`,
      [userId]
    );
    res.json(expenses);
  } catch (err) {
    console.error('Get expenses error:', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Add expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { userId, amount, description, category, subcategory, date, payment_method, notes } = req.body;

    if (!userId || !amount || !date) {
      return res.status(400).json({ error: 'User ID, amount, and date are required' });
    }

    const [result] = await pool.query(
      `INSERT INTO expenses (user_id, amount, description, category, subcategory, date, payment_method, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, amount, description || null, category || null, subcategory || null, date, payment_method || 'cash', notes || null]
    );

    // Log activity
    await pool.query(
      `INSERT INTO activity_log (user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?)`,
      [userId, 'add', 'expense', result.insertId, JSON.stringify({ amount, category })]
    );

    res.status(201).json({
      message: 'Expense added',
      id: result.insertId,
      userId,
      amount,
      description,
      category,
      subcategory,
      date
    });
  } catch (err) {
    console.error('Add expense error:', err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Update expense
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category, subcategory, date, payment_method, notes } = req.body;

    await pool.query(
      `UPDATE expenses SET amount = ?, description = ?, category = ?, subcategory = ?, date = ?, payment_method = ?, notes = ?, updated_at = NOW()
       WHERE id = ?`,
      [amount, description, category, subcategory, date, payment_method, notes, id]
    );

    res.json({ message: 'Expense updated', id });
  } catch (err) {
    console.error('Update expense error:', err);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM expenses WHERE id = ?', [id]);
    res.json({ message: 'Expense deleted', id });
  } catch (err) {
    console.error('Delete expense error:', err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// ========================
// BUDGET ROUTES
// ========================

// Get budgets for a user
app.get('/api/budgets/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [budgets] = await pool.query(
      `SELECT * FROM budgets WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    res.json(budgets);
  } catch (err) {
    console.error('Get budgets error:', err);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Add budget
app.post('/api/budgets', async (req, res) => {
  try {
    const { userId, category, amount, period, start_date, end_date } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: 'User ID and amount are required' });
    }

    const [result] = await pool.query(
      `INSERT INTO budgets (user_id, category, amount, period, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, category || null, amount, period || 'monthly', start_date || null, end_date || null]
    );

    res.status(201).json({
      message: 'Budget created',
      id: result.insertId
    });
  } catch (err) {
    console.error('Add budget error:', err);
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

// Update budget
app.put('/api/budgets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, period } = req.body;

    await pool.query(
      `UPDATE budgets SET category = ?, amount = ?, period = ?, updated_at = NOW() WHERE id = ?`,
      [category, amount, period, id]
    );

    res.json({ message: 'Budget updated', id });
  } catch (err) {
    console.error('Update budget error:', err);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// Delete budget
app.delete('/api/budgets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM budgets WHERE id = ?', [id]);
    res.json({ message: 'Budget deleted', id });
  } catch (err) {
    console.error('Delete budget error:', err);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

// ========================
// CATEGORY ROUTES
// ========================

// Get categories
app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await pool.query(
      `SELECT * FROM categories WHERE is_default = TRUE OR user_id IS NULL ORDER BY name`
    );
    res.json(categories);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get subcategories
app.get('/api/subcategories/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const [subcategories] = await pool.query(
      `SELECT * FROM subcategories WHERE category_id = ? ORDER BY name`,
      [categoryId]
    );
    res.json(subcategories);
  } catch (err) {
    console.error('Get subcategories error:', err);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

// ========================
// ACTIVITY LOG ROUTES
// ========================

// Get activity log
app.get('/api/activity/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const [activities] = await pool.query(
      `SELECT * FROM activity_log WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
      [userId, limit]
    );
    res.json(activities);
  } catch (err) {
    console.error('Get activity error:', err);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// ========================
// DASHBOARD STATS
// ========================

app.get('/api/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Total expenses this month
    const [monthTotal] = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM expenses 
       WHERE user_id = ? AND MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE())`,
      [userId]
    );

    // Expenses by category this month
    const [byCategory] = await pool.query(
      `SELECT category, SUM(amount) as total FROM expenses 
       WHERE user_id = ? AND MONTH(date) = MONTH(CURRENT_DATE()) AND YEAR(date) = YEAR(CURRENT_DATE())
       GROUP BY category ORDER BY total DESC`,
      [userId]
    );

    // Recent expenses
    const [recent] = await pool.query(
      `SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, created_at DESC LIMIT 5`,
      [userId]
    );

    // Budget status
    const [budgets] = await pool.query(
      `SELECT b.*, COALESCE(SUM(e.amount), 0) as spent
       FROM budgets b
       LEFT JOIN expenses e ON b.user_id = e.user_id AND b.category = e.category
         AND MONTH(e.date) = MONTH(CURRENT_DATE()) AND YEAR(e.date) = YEAR(CURRENT_DATE())
       WHERE b.user_id = ?
       GROUP BY b.id`,
      [userId]
    );

    res.json({
      monthTotal: monthTotal[0].total,
      byCategory,
      recentExpenses: recent,
      budgets
    });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
