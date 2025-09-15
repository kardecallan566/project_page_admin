"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { useText } from "@/context/TextContext"

interface Download {
  id: string
  name: string
  fileName: string
}

interface Category {
  id: string
  name: string
  downloads: Download[]
  systemId: string
  system: { name: string }
}

interface Props {
  categoriesWithDownloads: Category[]
}

interface System {
  id: string
  name: string
  link: string
}

export default function DownloadPageClient({ categoriesWithDownloads }: Props) {
  const [systems, setSystems] = useState<System[]>([])
  const { areas } = useText()

  const footerText = areas.find((a) => a.name === "footerTx")?.content || "Default footer text"

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const res = await fetch("/api/systems")
        if (!res.ok) throw new Error("Failed to fetch systems")
        const data = await res.json()
        setSystems(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchSystems()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex gap-[15px]"> <Link href={`/`}>
                <Button variant="outline">Início</Button>
              </Link></div>

          {/* Botões alinhados à direita */}
          <div className="flex gap-[15px]">
            {systems.map((system) => (
              <Link key={system.id} href={`${system.link}`} target="_blank">
                <Button variant="outline">{system.name}</Button>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
       <div>
                <div className="text-left max-w-3xl mx-auto mt-12 px-4">
                    <h2 className="text-4xl font-bold mb-4">Downloads {categoriesWithDownloads[0]?.system?.name}</h2>
                    <p className="text-muted-foreground">
                         Clique nos links abaixo para fazer o download das fichas de notificação e acompanhamento dos casos de tuberculose resistente e esquemas especiais:
                    </p>
                </div>
            </div>
      <div className="max-w-3xl mx-auto p-8 space-y-6">
        {categoriesWithDownloads.map((category) => (
          <div key={category.id}>
            <h3 className="text-2xl font-bold">{category.name}</h3>
            {category.downloads.length === 0 ? (
              <p className="text-muted-foreground">Nenhum download disponível.</p>
            ) : (
              <ul className="list-disc pl-6 space-y-2">
                {category.downloads.map((download) => (
                  <li key={download.id}>
                    <Link
                      href={`/api/downloads/${download.id}`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      {download.name || download.fileName}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div
  className="text-left max-w-3xl mx-auto mt-12 px-4 mb-8"
  dangerouslySetInnerHTML={{ __html: footerText }}
/>

      <Footer />
    </main>
  )
}
