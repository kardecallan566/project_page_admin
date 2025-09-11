// scripts/init-database.js
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.resolve("admin-panel.db");
const dbExists = fs.existsSync(dbPath);

console.log("Initializing database...");

try {
  // Cria o banco de dados (ou abre se já existir)
  const db = new Database(dbPath);

  // --- Criar tabelas ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS systems (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      link TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      system_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (system_id) REFERENCES systems(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS areas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      system_id INTEGER,
      category_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (system_id) REFERENCES systems(id) ON DELETE SET NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS downloads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // --- Inserir usuário admin padrão ---
  const insertAdmin = db.prepare(`
    INSERT OR IGNORE INTO users (username, password_hash)
    VALUES ('admin', '$2b$10$K7L/8Y1t85haFQReg6YzUOHx9rAhGEMQzJ5H5EnX.OP9cqloHxrGG')
  `);

  insertAdmin.run();

  console.log("✅ Database initialized successfully!");
  console.log(`📁 Database file: ${dbPath}`);
  console.log("🔐 Default admin credentials: admin / admin123");

  db.close();
} catch (error) {
  console.error("❌ Error initializing database:", error);
  process.exit(1);
}
