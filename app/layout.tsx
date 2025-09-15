import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { TextProvider } from "../context/TextContext"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "SiteTB",
  description: "",
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <TextProvider>
          <Suspense fallback={<div>Carregando...</div>}>
            <AuthProvider>{children}</AuthProvider>
          </Suspense>
        </TextProvider>
        <Analytics />
      </body>
    </html>
  )
}
