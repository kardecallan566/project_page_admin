import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Get download info before deleting
    const download = await prisma.download.findUnique({
      where: { id },
    })

    if (!download) {
      return NextResponse.json({ error: "Download not found" }, { status: 404 })
    }

    // Delete file from disk
    const filePath = join(process.cwd(), "uploads", download.filePath)
    if (existsSync(filePath)) {
      await unlink(filePath)
    }

    // Delete from database
    await prisma.download.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting download:", error)
    return NextResponse.json({ error: "Failed to delete download" }, { status: 500 })
  }
}
