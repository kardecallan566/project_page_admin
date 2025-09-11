import { type NextRequest, NextResponse } from "next/server"
import { downloadsDb } from "@/lib/database"
import { unlink } from "fs/promises"
import { join } from "path"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid download ID" }, { status: 400 })
    }

    // Get download info before deleting
    const downloads = downloadsDb.getAll()
    const download = downloads.find((d: any) => d.id === id)

    if (download) {
      // Delete file from filesystem
      try {
        const filePath = join(process.cwd(), "public", download.file_path)
        await unlink(filePath)
      } catch (error) {
        console.warn("Could not delete file:", error)
      }
    }

    // Delete from database
    downloadsDb.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting download:", error)
    return NextResponse.json({ error: "Failed to delete download" }, { status: 500 })
  }
}
