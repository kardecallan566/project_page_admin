import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const download = await prisma.download.findUnique({
      where: { id },
    })

    if (!download) {
      return NextResponse.json({ error: "Download not found" }, { status: 404 })
    }

    const filePath = join(process.cwd(), "uploads", download.filePath)

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found on disk" }, { status: 404 })
    }

    const fileBuffer = await readFile(filePath)

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": download.mimeType,
        "Content-Disposition": `attachment; filename="${download.fileName}"`,
        "Content-Length": download.fileSize.toString(),
      },
    })
  } catch (error) {
    console.error("Error serving file:", error)
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 })
  }
}
