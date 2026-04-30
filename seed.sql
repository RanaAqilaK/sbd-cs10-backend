-- Create tables for SBD Store

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    balance INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    total INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TRUNCATE TABLE transactions, items, users RESTART IDENTITY CASCADE;

-- Insert sample users (passwords are plain text for simplicity)
INSERT INTO users (name, username, email, phone, password, balance) VALUES
('Alice', 'alice', 'alice@example.com', '+1-555-0100', 'password123', 50000),
('Bob', 'bob', 'bob@example.com', '+1-555-0101', 'qwerty', 0),
('Charlie', 'charlie', 'charlie@example.com', '+1-555-0102', 'letmein', 100000)
ON CONFLICT (username) DO NOTHING;

-- Clear existing items and insert new ones
DELETE FROM items WHERE id > 0;

-- Insert sample items
INSERT INTO items (name, price, stock) VALUES
('Attack Shark X3', 350000, 25),
('Logitech G G515', 1800000, 18),
('MSI MAG 275QF', 3200000, 12),
('E Series Thinkpad', 8500000, 7);

-- Insert sample transactions with descriptions
INSERT INTO transactions (user_id, item_id, quantity, total, status, description) VALUES
(1, 1, 1, 350000, 'paid', 'Beli Attack Shark X3'),
(1, 2, 1, 1800000, 'paid', 'Beli Logitech G G515'),
(2, 3, 2, 6400000, 'pending', 'MSI MAG 275QF x2'),
(3, 4, 1, 8500000, 'pending', 'Beli E Series Thinkpad');