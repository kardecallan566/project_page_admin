"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, ExternalLink, Trash2 } from "lucide-react"

interface System {
  id: string
  name: string
  link: string
  createdAt: string
}

export function SystemsTab() {
  const [systems, setSystems] = useState<System[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newSystem, setNewSystem] = useState({ name: "", link: "" })
  const [error, setError] = useState("")

  useEffect(() => {
    fetchSystems()
  }, [])

  const fetchSystems = async () => {
    try {
      const response = await fetch("/api/systems")
      if (response.ok) {
        const data = await response.json()
        setSystems(data)
      }
    } catch (error) {
      setError("Failed to fetch systems")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSystem = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!newSystem.name || !newSystem.link) {
      setError("Please fill in all fields")
      return
    }

    try {
      const response = await fetch("/api/systems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSystem),
      })

      if (response.ok) {
        const createdSystem = await response.json()
        setSystems([...systems, createdSystem])
        setNewSystem({ name: "", link: "" })
        setIsDialogOpen(false)
      } else {
        setError("Failed to create system")
      }
    } catch (error) {
      setError("An error occurred")
    }
  }

  const handleDeleteSystem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this system?")) return

    try {
      const response = await fetch(`/api/systems/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSystems(systems.filter((system) => system.id !== id))
      } else {
        setError("Failed to delete system")
      }
    } catch (error) {
      setError("An error occurred")
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading systems...</div>
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All Systems</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add System
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New System</DialogTitle>
              <DialogDescription>Create a new system with a name and link.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSystem} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">System Name</Label>
                <Input
                  id="name"
                  value={newSystem.name}
                  onChange={(e) => setNewSystem({ ...newSystem, name: e.target.value })}
                  placeholder="Enter system name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">System Link</Label>
                <Input
                  id="link"
                  type="url"
                  value={newSystem.link}
                  onChange={(e) => setNewSystem({ ...newSystem, link: e.target.value })}
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create System</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {systems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No systems found. Add your first system to get started.
                </TableCell>
              </TableRow>
            ) : (
              systems.map((system) => (
                <TableRow key={system.id}>
                  <TableCell className="font-medium">{system.name}</TableCell>
                  <TableCell>
                    <a
                      href={system.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center"
                    >
                      {system.link}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </TableCell>
                  <TableCell>{new Date(system.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSystem(system.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
