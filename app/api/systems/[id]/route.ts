import { type NextRequest, NextResponse } from "next/server"
import { systemsDb } from "@/lib/database"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid system ID" }, { status: 400 })
    }

    systemsDb.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting system:", error)
    return NextResponse.json({ error: "Failed to delete system" }, { status: 500 })
  }
}
