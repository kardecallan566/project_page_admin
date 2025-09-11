import { type NextRequest, NextResponse } from "next/server"
import { areasDb } from "@/lib/database"

export async function GET() {
  try {
    const areas = areasDb.getAll()
    return NextResponse.json(areas)
  } catch (error) {
    console.error("Error fetching areas:", error)
    return NextResponse.json({ error: "Failed to fetch areas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, systemId, categoryId } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const result = areasDb.create(name, systemId || undefined, categoryId || undefined)
    return NextResponse.json({ success: true, id: result.lastInsertRowid })
  } catch (error) {
    console.error("Error creating area:", error)
    return NextResponse.json({ error: "Failed to create area" }, { status: 500 })
  }
}
