import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const systems = await prisma.system.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(systems)
  } catch (error) {
    console.error("Error fetching systems:", error)
    return NextResponse.json({ error: "Failed to fetch systems" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, link } = await request.json()

    if (!name || !link) {
      return NextResponse.json({ error: "Name and link are required" }, { status: 400 })
    }

    const system = await prisma.system.create({
      data: { name, link },
    })

    return NextResponse.json(system)
  } catch (error) {
    console.error("Error creating system:", error)
    return NextResponse.json({ error: "Failed to create system" }, { status: 500 })
  }
}
