import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { getDatabase } from "./database"

export interface User {
  id: number
  username: string
  created_at: string
}

// Database operations for Users
export const usersDb = {
  findByUsername: (username: string) => {
    const db = getDatabase()
    return db.prepare("SELECT * FROM users WHERE username = ?").get(username) as any
  },

  create: (username: string, password: string) => {
    const db = getDatabase()
    const passwordHash = bcrypt.hashSync(password, 10)
    return db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(username, passwordHash)
  },
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: number) {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  // Store session in cookie
  cookies().set("session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
  })

  // Store session data in memory (in production, use Redis or database)
  sessionStore.set(sessionId, { userId, expiresAt })

  return sessionId
}

export async function getSession() {
  const sessionId = cookies().get("session")?.value
  if (!sessionId) return null

  const session = sessionStore.get(sessionId)
  if (!session || session.expiresAt < new Date()) {
    sessionStore.delete(sessionId)
    return null
  }

  return session
}

export async function deleteSession() {
  const sessionId = cookies().get("session")?.value
  if (sessionId) {
    sessionStore.delete(sessionId)
  }

  cookies().delete("session")
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  if (!session) return null

  const db = getDatabase()
  const user = db.prepare("SELECT id, username, created_at FROM users WHERE id = ?").get(session.userId) as User
  return user || null
}

// Simple in-memory session store (use Redis in production)
const sessionStore = new Map<string, { userId: number; expiresAt: Date }>()
