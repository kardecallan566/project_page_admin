"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface Area {
  id: string
  name: string
  content: string
}

interface TextContextType {
  areas: Area[]
  reloadAreas: () => Promise<void>
}

const TextContext = createContext<TextContextType | undefined>(undefined)

export const TextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [areas, setAreas] = useState<Area[]>([])

  const fetchAreas = async () => {
    try {
      const res = await fetch("/api/areas")
      if (res.ok) {
        const data = await res.json()
        setAreas(data)
      }
    } catch (error) {
      console.error("Failed to fetch areas", error)
    }
  }

  useEffect(() => {
    fetchAreas()
  }, [])

  return (
    <TextContext.Provider value={{ areas, reloadAreas: fetchAreas }}>
      {children}
    </TextContext.Provider>
  )
}

export const useText = () => {
  const context = useContext(TextContext)
  if (!context) throw new Error("useText must be used within a TextProvider")
  return context
}
