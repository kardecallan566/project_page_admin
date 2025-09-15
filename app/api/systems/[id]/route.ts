import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params

    await prisma.system.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting system:", error)
    return NextResponse.json({ error: "Failed to delete system" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }:{ params: { id: string } }) {
  try {
    const { id }= await params
    const { name, link } = await request.json()

    if (!name || !link) {
      return NextResponse.json({ error: "Name and link are required" }, { status: 400 })
    }

    const updatedSystem = await prisma.system.update({
      where: { id },
      data: { name, link },
    })

    return NextResponse.json(updatedSystem)
  } catch (error) {
    console.error("Error updating system:", error)
    return NextResponse.json({ error: "Failed to update system" }, { status: 500 })
  }
}
