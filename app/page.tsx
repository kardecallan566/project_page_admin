"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useText } from "@/context/TextContext"
import { Footer } from "@/components/footer"
import Link from "next/link";

interface Category {
  id: string
  name: string
  systemId: string
  system: { name: string }
}

interface System {
  id: string
  name: string
  link: string
}


export default function HomePage() {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [systems, setSystems] = useState<System[]>([]);
  const { areas } = useText()

  const heroText = areas.find(a => a.name === "botdy")?.content || "Default hero text";

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch downloads");
        const data = await res.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error fetching downloads:", error);
      }
    };

    const fetchSystems = async () => {
      try {
        const res1 = await fetch("/api/systems");
        if (!res1.ok) throw new Error("Failed to fetch systems");
        const data1 = await res1.json();
        setSystems(data1);
      } catch (error) {
        console.error("Error fetching systems:", error);
      }
    };

    fetchCategorias();
    fetchSystems();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground"> </h1>

          {/* Botões alinhados à direita com espaçamento */}
          <div className="flex gap-[15px]">
            {systems.map((system) => (
              <Link key={system.id} href={`${system.link}`} target="_blank">
                <Button variant="outline">
                  {system.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Image */}
          <div className="relative w-full text-center rounded-lg overflow-hidden bg-muted">
            <img
              src="/modern-admin-dashboard.png"
              alt="Admin System Dashboard"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hero Text */}
          <div className="space-y-6">
            <h2 className="text-4xl text-center md:text-5xl font-bold text-foreground text-balance">
              Sitetb
            </h2>
            <p dangerouslySetInnerHTML={{ __html: heroText }}>
            </p>

            {/* 🔥 Botões vindos da API */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {categorias.map((categoria) => (
                <Link
                  key={categoria.id}
                  href={`/download/${categoria.systemId}`}
                >
                  <Button size="lg" className="w-full sm:w-auto">
                    {categoria.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
       <Footer />
    </main>
  );
}
