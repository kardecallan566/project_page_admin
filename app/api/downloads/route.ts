import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// GET: listar downloads (opcionalmente por categoria)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")

    const downloads = await prisma.download.findMany({
      where: categoryId ? { categoryId } : {},
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(downloads)
  } catch (error) {
    console.error("Error fetching downloads:", error)
    return NextResponse.json({ error: "Failed to fetch downloads" }, { status: 500 })
  }
}

// POST: criar/upload de download
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const file = formData.get("file") as File
    const categoryId = formData.get("categoryId") as string

    if (!name || !file || !categoryId) {
      return NextResponse.json({ error: "Name, file and categoryId are required" }, { status: 400 })
    }

    // Criar diretório uploads se não existir
    const uploadsDir = join(process.cwd(), "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Gerar nome único do arquivo
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`
    const filePath = join(uploadsDir, fileName)

    // Salvar arquivo no disco
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    // Salvar registro no banco de dados
    const download = await prisma.download.create({
      data: {
        name,
        fileName: file.name,
        filePath: fileName,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
        categoryId,
      },
    })

    return NextResponse.json(download)
  } catch (error) {
    console.error("Error creating download:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
