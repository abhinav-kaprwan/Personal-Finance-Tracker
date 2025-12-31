CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'user', 'read-only')) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  type VARCHAR(10) CHECK (type IN ('income', 'expense'))
);

-- transactions
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(10) CHECK (type IN ('income', 'expense')),
  amount NUMERIC(12,2),
  category_id INT REFERENCES categories(id),
  date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO categories (name, type) VALUES
-- Expense
('Food', 'expense'),
('Transport', 'expense'),
('Rent', 'expense'),
('Utilities', 'expense'),
('Groceries', 'expense'),
('Entertainment', 'expense'),
('Health', 'expense'),
('Education', 'expense'),
('Shopping', 'expense'),
('Travel', 'expense'),
('Insurance', 'expense'),
('Miscellaneous', 'expense'),

-- Income
('Salary', 'income'),
('Freelance', 'income'),
('Business', 'income'),
('Investments', 'income'),
('Gifts', 'income'),
('Other', 'income');
ON CONFLICT (name) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
