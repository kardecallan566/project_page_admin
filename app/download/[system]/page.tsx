import { prisma } from "@/lib/prisma"
import DownloadPageClient from "./DownloadPageClient"

interface PageProps {
  params: { system: string }
}

export default async function DownloadPage(props: PageProps) {
  const { params } = await props
  const systemId = params.system

  // Buscar categorias e downloads no servidor
  const categories = await prisma.category.findMany({
    where: { systemId },
    orderBy: { name: "asc" },
    include: { system: { select: { name: true } } },
  })

  const categoriesWithDownloads = await Promise.all(
    categories.map(async (category) => {
      const downloads = await prisma.download.findMany({
        where: { categoryId: category.id },
        orderBy: { createdAt: "desc" },
      })
      return { ...category, downloads }
    })
  )

  return <DownloadPageClient categoriesWithDownloads={categoriesWithDownloads} />
}