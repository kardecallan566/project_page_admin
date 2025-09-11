import { type NextRequest, NextResponse } from "next/server"
import { downloadsDb } from "@/lib/database"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function GET() {
  try {
    const downloads = downloadsDb.getAll()
    return NextResponse.json(downloads)
  } catch (error) {
    console.error("Error fetching downloads:", error)
    return NextResponse.json({ error: "Failed to fetch downloads" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const file = formData.get("file") as File

    if (!name || !file) {
      return NextResponse.json({ error: "Name and file are required" }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads")
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
    const filePath = join(uploadsDir, fileName)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Save to database
    const result = downloadsDb.create(name, `/uploads/${fileName}`, file.name)
    return NextResponse.json({ success: true, id: result.lastInsertRowid })
  } catch (error) {
    console.error("Error creating download:", error)
    return NextResponse.json({ error: "Failed to create download" }, { status: 500 })
  }
}
