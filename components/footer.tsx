// components/Footer.tsx
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground space-y-2">
        <p>Coordenação-Geral de Vigilância da Tuberculose, Micoses Endêmicas e Micobactérias não Tuberculosas (CGTM)</p>
        <p>Ministério da Saúde</p>
        <Link href="/login" passHref>
          
            Painel de Administração
         
        </Link>
      </div>
    </footer>
  )
}
