-- Initialize database with default admin user
-- This script will be run to set up the initial database state

-- Create admin user (password: admin123)
INSERT OR IGNORE INTO User ( username, password, createdAt, updatedAt) 
VALUES ( 
  'admin', 
  '$2a$12$LQv3c1yqBWVHxkd0LQ1Gv.6FqB0WgUDvKzjFxg8rIxY8rIxY8rIxY8', 
  datetime('now'), 
  datetime('now')
);

-- Sample data for testing
INSERT OR IGNORE INTO System (id, name, link, createdAt, updatedAt) 
VALUES 
  ('system-1', 'Main System', 'https://example.com/main', datetime('now'), datetime('now')),
  ('system-2', 'Secondary System', 'https://example.com/secondary', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO Category (id, name, systemId, createdAt, updatedAt) 
VALUES 
  ('category-1', 'Category A', 'system-1', datetime('now'), datetime('now')),
  ('category-2', 'Category B', 'system-1', datetime('now'), datetime('now'));

INSERT OR IGNORE INTO Area (id, name, categoryId, createdAt, updatedAt) 
VALUES 
  ('area-1', 'Area 1', 'category-1', datetime('now'), datetime('now')),
  ('area-2', 'Area 2', 'category-1', datetime('now'), datetime('now'));
