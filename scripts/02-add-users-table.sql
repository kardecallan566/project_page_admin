-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
-- This is a proper bcrypt hash for 'admin123'
INSERT OR IGNORE INTO users (username, password_hash) 
VALUES ('admin', '$2b$10$K7L/8Y1t85haFQReg6YzUOHx9rAhGEMQzJ5H5EnX.OP9cqloHxrGG');
