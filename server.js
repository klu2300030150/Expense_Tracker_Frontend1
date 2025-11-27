import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 5000;

// Database Configuration - Uses env vars or falls back to local
function parseDatabaseUrl(url) {
  try {
    const u = new URL(url);
    // Expect format: mysql://user:pass@host:port/dbname
    return {
      host: u.hostname,
      port: u.port ? parseInt(u.port, 10) : 3306,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, '')
    };
  } catch (e) {
    console.warn('Invalid DATABASE_URL, falling back to discrete env vars');
    return null;
  }
}

const fromUrl = process.env.DATABASE_URL ? parseDatabaseUrl(process.env.DATABASE_URL) : null;

const DB_CONFIG = fromUrl || {
  host: process.env.MYSQLHOST || process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT || process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQLUSER || process.env.MYSQL_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || 'Sreekar@8297',
  database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'expense_tracker'
};

// AWS RDS Details (for reference):
// Host: expensetrackerbackend.cxy4ogqqgubd.eu-north-1.rds.amazonaws.com
// Database: ExpenseTrackerBackend

// Railway MySQL (production):
// mysql://root:DPHhMBJuYlcQlaeZmXsFGgUZZLkqrhhX@gondola.proxy.rlwy.net:27737/railway

// Middleware - Enhanced CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

// MySQL Connection Pool (will be initialized after DB setup)
let pool;

// Auto-create database and tables
async function initializeDatabase() {
  try {
    // First connect without database to create it
    const tempConn = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password
    });

    // Create database if not exists
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS ${DB_CONFIG.database}`);
    console.log('✅ Database "expense_tracker" ready');
    await tempConn.end();

    // Now create pool with database
    pool = mysql.createPool({
      ...DB_CONFIG,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create all tables
    await createTables();
    
    // Add missing columns if they don't exist (for upgrades)
    await addMissingColumns();
    
    console.log('✅ All tables ready');
    console.log('✅ Connected to LOCAL MySQL database');

  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    console.error('Make sure MySQL is running on localhost with user "root" and password "Sreekar@8297"');
    process.exit(1);
  }
}

// Add missing columns to existing tables
async function addMissingColumns() {
  try {
    // Check and add notes column
    const [cols] = await pool.query(`SHOW COLUMNS FROM expenses LIKE 'notes'`);
    if (cols.length === 0) {
      await pool.query(`ALTER TABLE expenses ADD COLUMN notes TEXT`);
      console.log('✅ Added notes column to expenses');
    }
    
    // Check and add updated_at column  
    const [cols2] = await pool.query(`SHOW COLUMNS FROM expenses LIKE 'updated_at'`);
    if (cols2.length === 0) {
      await pool.query(`ALTER TABLE expenses ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
      console.log('✅ Added updated_at column to expenses');
    }
    
    // Make category nullable
    await pool.query(`ALTER TABLE expenses MODIFY COLUMN category VARCHAR(50)`);
  } catch (err) {
    console.log('Column update check:', err.message);
  }
}

// Create all required tables
async function createTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone_number VARCHAR(20),
      currency VARCHAR(10) DEFAULT 'USD',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      icon VARCHAR(50),
      color VARCHAR(20),
      user_id INT,
      is_default BOOLEAN DEFAULT FALSE
    )`,
    `CREATE TABLE IF NOT EXISTS subcategories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      category_id INT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS expenses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(50),
      subcategory VARCHAR(50),
      description TEXT,
      notes TEXT,
      date DATE NOT NULL,
      payment_method VARCHAR(30) DEFAULT 'cash',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS budgets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      category VARCHAR(50) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      period VARCHAR(20) DEFAULT 'monthly',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS activity_log (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      action VARCHAR(50) NOT NULL,
      entity_type VARCHAR(50),
      entity_id INT,
      details TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  ];

  for (const sql of tables) {
    await pool.query(sql);
  }

  // Seed default categories if empty
  const [cats] = await pool.query('SELECT COUNT(*) as count FROM categories WHERE is_default = TRUE');
  if (cats[0].count === 0) {
    const defaultCategories = [
      ['Food & Dining', '🍔', '#FF6384', true],
      ['Transportation', '🚗', '#36A2EB', true],
      ['Shopping', '🛒', '#FFCE56', true],
      ['Entertainment', '🎬', '#4BC0C0', true],
      ['Bills & Utilities', '💡', '#9966FF', true],
      ['Healthcare', '🏥', '#FF9F40', true],
      ['Education', '📚', '#C9CBCF', true],
      ['Travel', '✈️', '#7C4DFF', true],
      ['Personal Care', '💅', '#FF6F61', true],
      ['Other', '📦', '#808080', true]
    ];
    for (const [name, icon, color, isDefault] of defaultCategories) {
      await pool.query(
        'INSERT INTO categories (name, icon, color, is_default) VALUES (?, ?, ?, ?)',
        [name, icon, color, isDefault]
      );
    }
    console.log('✅ Default categories seeded');
  }
}

// Helper: Generate simple token (includes usernId for extraction)
function generateToken(userId) {
  return Buffer.from(`${userId}-${Date.now()}-${Math.random().toString(36)}`).toString('base64');
}

// Helper: Extract userId from token
function getUserIdFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const userId = decoded.split('-')[0];
    return parseInt(userId);
  } catch (e) {
    return null;
  }
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

// Get all expenses (using token)
app.get('/api/expenses', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - invalid token' });
    }
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

// Get all expenses for a user (with userId in URL)
app.get('/api/expenses/user/:userId', async (req, res) => {
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

// Add expense (extract userId from token if not in body)
app.post('/api/expenses', async (req, res) => {
  try {
    let { userId, amount, description, category, subcategory, date, payment_method, notes } = req.body;

    // If userId not in body, extract from token
    if (!userId) {
      userId = getUserIdFromToken(req);
    }

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - no user ID' });
    }

    if (!amount || !date) {
      return res.status(400).json({ error: 'Amount and date are required' });
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

// Get budgets (using token)
app.get('/api/budgets', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
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

// Get budgets for a user (with userId in URL)
app.get('/api/budgets/user/:userId', async (req, res) => {
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
    let { userId, category, amount, period, start_date, end_date } = req.body;
    
    if (!userId) {
      userId = getUserIdFromToken(req);
    }

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

// Initialize database then start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`\n📌 Using LOCAL MySQL: root@localhost:3306/expense_tracker`);
  });
});
