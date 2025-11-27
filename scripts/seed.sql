-- Expense Tracker Database Schema
-- Auto-generated seed file for Railway MySQL

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon VARCHAR(50) DEFAULT '📁',
    color VARCHAR(20) DEFAULT '#6c757d',
    user_id INT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_categories (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category_id INT NOT NULL,
    user_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category_subcategories (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    category_id INT,
    subcategory_id INT,
    category VARCHAR(50),
    subcategory VARCHAR(50),
    date DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL,
    INDEX idx_user_expenses (user_id),
    INDEX idx_expense_date (date),
    INDEX idx_user_date (user_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT,
    category VARCHAR(50),
    amount DECIMAL(10, 2) NOT NULL,
    period ENUM('daily', 'weekly', 'monthly', 'yearly') DEFAULT 'monthly',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_user_budgets (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_activity (user_id),
    INDEX idx_activity_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default categories
INSERT IGNORE INTO categories (id, name, icon, color, is_default) VALUES
(1, 'Food & Dining', '🍔', '#FF6384', TRUE),
(2, 'Transportation', '🚗', '#36A2EB', TRUE),
(3, 'Shopping', '🛒', '#FFCE56', TRUE),
(4, 'Entertainment', '🎬', '#4BC0C0', TRUE),
(5, 'Bills & Utilities', '💡', '#9966FF', TRUE),
(6, 'Health', '💊', '#FF9F40', TRUE),
(7, 'Education', '📚', '#C9CBCF', TRUE),
(8, 'Travel', '✈️', '#7CB342', TRUE),
(9, 'Personal Care', '💅', '#EC407A', TRUE),
(10, 'Other', '📦', '#78909C', TRUE);

-- Insert default subcategories
INSERT IGNORE INTO subcategories (id, name, category_id) VALUES
-- Food & Dining
(1, 'Groceries', 1),
(2, 'Restaurants', 1),
(3, 'Coffee & Snacks', 1),
(4, 'Food Delivery', 1),
-- Transportation
(5, 'Fuel', 2),
(6, 'Public Transit', 2),
(7, 'Parking', 2),
(8, 'Ride Share', 2),
-- Shopping
(9, 'Clothing', 3),
(10, 'Electronics', 3),
(11, 'Home & Garden', 3),
-- Entertainment
(12, 'Movies', 4),
(13, 'Games', 4),
(14, 'Subscriptions', 4),
-- Bills
(15, 'Electricity', 5),
(16, 'Internet', 5),
(17, 'Phone', 5),
(18, 'Rent', 5);

SELECT 'Database setup complete!' AS status, COUNT(*) AS tables_count 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE();
