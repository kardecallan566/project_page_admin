import { type NextRequest, NextResponse } from "next/server"
import { areasDb } from "@/lib/database"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid area ID" }, { status: 400 })
    }

    areasDb.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting area:", error)
    return NextResponse.json({ error: "Failed to delete area" }, { status: 500 })
  }
}
