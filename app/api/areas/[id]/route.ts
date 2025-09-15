import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params // ✅ agora funciona
    const { name, content } = await request.json()

    if (!name || !content) {
      return NextResponse.json(
        { error: "Name and content are required" },
        { status: 400 }
      )
    }

    const updatedArea = await prisma.area.update({
      where: { id },
      data: { name, content },
    })

    return NextResponse.json(updatedArea)
  } catch (error) {
    console.error("Error updating area:", error)
    return NextResponse.json(
      { error: "Failed to update area" },
      { status: 500 }
    )
  }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params

    await prisma.area.delete({ where: { id } })

    return NextResponse.json({ message: "Area deleted successfully" })
  } catch (error) {
    console.error("Error deleting area:", error)
    return NextResponse.json({ error: "Failed to delete area" }, { status: 500 })
  }
}
