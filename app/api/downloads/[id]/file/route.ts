import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

// Listar downloads (GET) por categoria
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const categoryId = url.searchParams.get("categoryId");

    const downloads = await prisma.download.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(downloads);
  } catch (error) {
    console.error("Error fetching downloads:", error);
    return NextResponse.json({ error: "Failed to fetch downloads" }, { status: 500 });
  }
}

// Criar upload (POST)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const file = formData.get("file") as File;
    const categoryId = formData.get("categoryId") as string;

    if (!name || !file || !categoryId) {
      return NextResponse.json({ error: "Name, file and categoryId are required" }, { status: 400 });
    }

    const uploadsDir = join(process.cwd(), "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = join(uploadsDir, fileName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const download = await prisma.download.create({
      data: {
        name,
        fileName: file.name,
        filePath: fileName,
        fileSize: file.size,
        mimeType: file.type || "application/octet-stream",
        categoryId,
      },
    });

    return NextResponse.json(download);
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
  
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const download = await prisma.download.findUnique({ where: { id } });
    if (!download) return NextResponse.json({ error: "Download not found" }, { status: 404 });

    // Apaga o arquivo do disco
    const filePath = join(process.cwd(), "uploads", download.filePath);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    // Apaga do banco
    await prisma.download.delete({ where: { id } });

    return NextResponse.json({ message: "Download deleted successfully" });
  } catch (error) {
    console.error("Error deleting download:", error);
    return NextResponse.json({ error: "Failed to delete download" }, { status: 500 });
  }
}