"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Download {
  id: number;
  name: string;
  filePath: string;
}

export default function HomePage() {
  const [downloads, setDownloads] = useState<Download[]>([]);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const res = await fetch("/api/downloads");
        if (!res.ok) throw new Error("Failed to fetch downloads");
        const data = await res.json();
        setDownloads(data);
      } catch (error) {
        console.error("Error fetching downloads:", error);
      }
    };

    fetchDownloads();
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground"> </h1>
          <Link href="/login">
            <Button variant="outline">admin panel</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Image */}
          <div className="relative w-full rounded-lg overflow-hidden bg-muted">
            <img
              src="/modern-admin-dashboard.png"
              alt="Admin System Dashboard"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hero Text */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
              sitetb
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              A comprehensive management platform for organizing systems,
              categories, areas, and downloads. Streamline your administrative
              tasks with our intuitive interface and powerful tools.
            </p>

            {/* 🔥 Botões vindos da API */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {downloads.map((download) => (
                <Link
                  key={download.id}
                  href={`/uploads/${download.filePath}`}
                  target="_blank"
                >
                  <Button size="lg" className="w-full sm:w-auto">
                    {download.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 Admin System. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
