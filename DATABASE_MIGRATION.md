# 🗄️ Database Migration Guide

## Quick Migration Steps

### Step 1: Open MySQL Command Line or MySQL Workbench

### Step 2: Run these SQL commands:

```sql
-- Use your database
USE expense_tracker;

-- Add subcategory column
ALTER TABLE expenses 
ADD COLUMN subcategory VARCHAR(100) NULL AFTER category;

-- Verify the change
DESCRIBE expenses;
```

### Step 3: Verify the column was added

You should see output like:
```
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| id          | bigint       | NO   | PRI | NULL    | auto_increment |
| user_id     | bigint       | NO   |     | NULL    |                |
| amount      | decimal(…)   | NO   |     | NULL    |                |
| category    | varchar(255) | NO   |     | NULL    |                |
| subcategory | varchar(100) | YES  |     | NULL    |                | ← NEW!
| description | varchar(255) | YES  |     | NULL    |                |
| date        | date         | NO   |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+
```

---

## Alternative: Using MySQL Workbench

1. Open MySQL Workbench
2. Connect to your database
3. Click on "expense_tracker" schema
4. Click "SQL" button (or open a new SQL tab)
5. Copy and paste the ALTER TABLE command
6. Click Execute (⚡ button)
7. Check "Result Grid" for success message

---

## ✅ Migration Complete!

After running the SQL:
1. ✅ Restart the Spring Boot backend
2. ✅ Refresh the frontend in your browser
3. ✅ Start adding expenses with subcategories!

---

## 🧪 Test the Feature

1. Go to Dashboard
2. Click "Add New Expense"
3. Select Category: **Food**
4. You'll see Subcategory dropdown appear
5. Select Subcategory: **Snacks**
6. Add amount and description
7. Save expense
8. See the expense with both category and subcategory badges!

---

## ⚠️ Important Notes

- **Subcategory is optional** - Old expenses without subcategory will still work
- **No data loss** - Existing expenses are unaffected
- **Backward compatible** - App works with or without subcategory
- **Safe migration** - Just adds a new column, doesn't modify existing data

---

## 🔧 Troubleshooting

### Error: "Table 'expenses' doesn't exist"
- Make sure you're using the correct database: `USE expense_tracker;`
- Check if your database name is different

### Error: "Duplicate column name 'subcategory'"
- Column already exists! Migration already done.
- No need to run again.

### Error: "Access denied"
- Make sure you have ALTER TABLE permissions
- Login with root user or admin user

---

**Once migration is complete, restart both backend and frontend to see the new subcategory feature!** 🎉
