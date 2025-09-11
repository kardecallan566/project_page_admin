import { type NextRequest, NextResponse } from "next/server"
import { systemsDb } from "@/lib/database"

export async function GET() {
  try {
    const systems = systemsDb.getAll()
    return NextResponse.json(systems)
  } catch (error) {
    console.error("Error fetching systems:", error)
    return NextResponse.json({ error: "Failed to fetch systems" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, link } = await request.json()

    if (!name || !link) {
      return NextResponse.json({ error: "Name and link are required" }, { status: 400 })
    }

    const result = systemsDb.create(name, link)
    return NextResponse.json({ success: true, id: result.lastInsertRowid })
  } catch (error) {
    console.error("Error creating system:", error)
    return NextResponse.json({ error: "Failed to create system" }, { status: 500 })
  }
}
