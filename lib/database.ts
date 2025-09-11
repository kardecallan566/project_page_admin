import Database from "better-sqlite3"
import { readFileSync } from "fs"
import { join } from "path"

let db: Database.Database | null = null

export function getDatabase() {
  if (!db) {
    // Create database file in the project root
    db = new Database("admin-panel.db")

    // Initialize tables
    initializeTables()
  }
  return db
}

function initializeTables() {
  if (!db) return

  try {
    // Read and execute the SQL schema
    const schemaPath = join(process.cwd(), "scripts", "01-create-tables.sql")
    const schema = readFileSync(schemaPath, "utf-8")

    // Split by semicolon and execute each statement
    const statements = schema.split(";").filter((stmt) => stmt.trim())

    statements.forEach((statement) => {
      if (statement.trim()) {
        db!.exec(statement)
      }
    })

    try {
      const usersSchemaPath = join(process.cwd(), "scripts", "02-add-users-table.sql")
      const usersSchema = readFileSync(usersSchemaPath, "utf-8")
      const usersStatements = usersSchema.split(";").filter((stmt) => stmt.trim())

      usersStatements.forEach((statement) => {
        if (statement.trim()) {
          db!.exec(statement)
        }
      })

      console.log("Users table initialized successfully")
    } catch (error) {
      console.log("Users table already exists or error:", error)
    }

    console.log("Database tables initialized successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}

// Database operations for Systems
export const systemsDb = {
  getAll: () => {
    const db = getDatabase()
    return db.prepare("SELECT * FROM systems ORDER BY created_at DESC").all()
  },

  create: (name: string, link: string) => {
    const db = getDatabase()
    return db.prepare("INSERT INTO systems (name, link) VALUES (?, ?)").run(name, link)
  },

  delete: (id: number) => {
    const db = getDatabase()
    return db.prepare("DELETE FROM systems WHERE id = ?").run(id)
  },
}

// Database operations for Categories
export const categoriesDb = {
  getAll: () => {
    const db = getDatabase()
    return db
      .prepare(`
      SELECT c.*, s.name as system_name 
      FROM categories c 
      JOIN systems s ON c.system_id = s.id 
      ORDER BY c.created_at DESC
    `)
      .all()
  },

  create: (name: string, systemId: number) => {
    const db = getDatabase()
    return db.prepare("INSERT INTO categories (name, system_id) VALUES (?, ?)").run(name, systemId)
  },

  delete: (id: number) => {
    const db = getDatabase()
    return db.prepare("DELETE FROM categories WHERE id = ?").run(id)
  },
}

// Database operations for Areas
export const areasDb = {
  getAll: () => {
    const db = getDatabase()
    return db
      .prepare(`
      SELECT a.*, 
             s.name as system_name,
             c.name as category_name
      FROM areas a 
      LEFT JOIN systems s ON a.system_id = s.id 
      LEFT JOIN categories c ON a.category_id = c.id 
      ORDER BY a.created_at DESC
    `)
      .all()
  },

  create: (name: string, systemId?: number, categoryId?: number) => {
    const db = getDatabase()
    return db
      .prepare("INSERT INTO areas (name, system_id, category_id) VALUES (?, ?, ?)")
      .run(name, systemId || null, categoryId || null)
  },

  delete: (id: number) => {
    const db = getDatabase()
    return db.prepare("DELETE FROM areas WHERE id = ?").run(id)
  },
}

// Database operations for Downloads
export const downloadsDb = {
  getAll: () => {
    const db = getDatabase()
    return db.prepare("SELECT * FROM downloads ORDER BY created_at DESC").all()
  },

  create: (name: string, filePath: string, fileName: string) => {
    const db = getDatabase()
    return db
      .prepare("INSERT INTO downloads (name, file_path, file_name) VALUES (?, ?, ?)")
      .run(name, filePath, fileName)
  },

  delete: (id: number) => {
    const db = getDatabase()
    return db.prepare("DELETE FROM downloads WHERE id = ?").run(id)
  },
}
