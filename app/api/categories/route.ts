import { type NextRequest, NextResponse } from "next/server"
import { categoriesDb } from "@/lib/database"

export async function GET() {
  try {
    const categories = categoriesDb.getAll()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, systemId } = await request.json()

    if (!name || !systemId) {
      return NextResponse.json({ error: "Name and system ID are required" }, { status: 400 })
    }

    const result = categoriesDb.create(name, systemId)
    return NextResponse.json({ success: true, id: result.lastInsertRowid })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
