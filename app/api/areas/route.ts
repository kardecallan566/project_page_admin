import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const areas = await prisma.area.findMany({
      include: {
        category: {
          select: {
            name: true,
            system: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(areas)
  } catch (error) {
    console.error("Error fetching areas:", error)
    return NextResponse.json({ error: "Failed to fetch areas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, categoryId } = await request.json()

    if (!name || !categoryId) {
      return NextResponse.json({ error: "Name and category ID are required" }, { status: 400 })
    }

    const area = await prisma.area.create({
      data: { name, categoryId },
      include: {
        category: {
          select: {
            name: true,
            system: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(area)
  } catch (error) {
    console.error("Error creating area:", error)
    return NextResponse.json({ error: "Failed to create area" }, { status: 500 })
  }
}
