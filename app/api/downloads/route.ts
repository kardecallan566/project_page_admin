import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET() {
  try {
    const downloads = await prisma.download.findMany({
      orderBy: { createdAt: "desc" },
    })
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
    const uploadsDir = join(process.cwd(), "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`
    const filePath = join(uploadsDir, fileName)

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Save to database
    const download = await prisma.download.create({
      data: {
        name,
        fileName: file.name,
        filePath: fileName, // Store relative path
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
      },
    })

    return NextResponse.json(download)
  } catch (error) {
    console.error("Error creating download:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
