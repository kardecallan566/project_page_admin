import { prisma } from "@/lib/prisma"
import DownloadPageClient from "./DownloadPageClient"

interface PageProps {
  params: { system: string }
}

export default async function DownloadPage({ params }: PageProps) {
  const systemId = params.system

  // Buscar categorias do sistema
  const categories = await prisma.category.findMany({
    where: { systemId }, 
    orderBy: { name: "asc" },
  })

  // Adicionar downloads em cada categoria
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
