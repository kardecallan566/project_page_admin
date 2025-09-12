"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Download {
  id: number;
  name: string;
  filePath: string;
}

export default function LinksSection() {
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
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {downloads.map((download) => (
        <Link
          key={download.id}
          href={`/uploads/${download.filePath}`} // direciona para o arquivo salvo
          target="_blank"
        >
          <Button size="lg" className="w-full sm:w-auto">
            {download.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}
