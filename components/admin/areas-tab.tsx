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
import { Plus, Trash2, Pencil } from "lucide-react"

interface Area {
  id: string
  name: string
  content: string
  createdAt: string
}

export function AreasTab() {
  const [areas, setAreas] = useState<Area[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newArea, setNewArea] = useState({ name: "", content: "" })
  const [error, setError] = useState("")

  // estados para edição
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedArea, setSelectedArea] = useState<Area | null>(null)

  useEffect(() => {
    fetchAreas()
  }, [])

  const fetchAreas = async () => {
    try {
      const response = await fetch("/api/areas")
      if (response.ok) {
        const data = await response.json()
        setAreas(data)
      }
    } catch (error) {
      setError("Failed to fetch areas")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!newArea.name || !newArea.content) {
      setError("Please fill in all fields")
      return
    }

    try {
      const response = await fetch("/api/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArea),
      })

      if (response.ok) {
        const createdArea = await response.json()
        setAreas([...areas, createdArea])
        setNewArea({ name: "", content: "" })
        setIsDialogOpen(false)
      } else {
        setError("Failed to create area")
      }
    } catch (error) {
      setError("An error occurred")
    }
  }

  const handleEditArea = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedArea) return

    try {
      const response = await fetch(`/api/areas/${selectedArea.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedArea),
      })

      if (response.ok) {
        const updatedArea = await response.json()
        setAreas(areas.map((a) => (a.id === updatedArea.id ? updatedArea : a)))
        setIsEditDialogOpen(false)
      } else {
        setError("Failed to update area")
      }
    } catch (error) {
      setError("An error occurred")
    }
  }

  const handleDeleteArea = async (id: string) => {
    if (!confirm("Are you sure you want to delete this area?")) return

    try {
      const response = await fetch(`/api/areas/${id}`, { method: "DELETE" })
      if (response.ok) {
        setAreas(areas.filter((area) => area.id !== id))
      } else {
        setError("Failed to delete area")
      }
    } catch (error) {
      setError("An error occurred")
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading areas...</div>
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All Areas</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Area
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Area</DialogTitle>
              <DialogDescription>Create a new area with free text content.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddArea} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Area Name</Label>
                <Input
                  id="name"
                  value={newArea.name}
                  onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                  placeholder="Enter area name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <textarea
                  id="content"
                  className="w-full border rounded-md p-2"
                  rows={5}
                  value={newArea.content}
                  onChange={(e) => setNewArea({ ...newArea, content: e.target.value })}
                  placeholder="Write your text here..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Area</Button>
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
              <TableHead>Content</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Edit</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No areas found. Add your first area to get started.
                </TableCell>
              </TableRow>
            ) : (
              areas.map((area) => (
                <TableRow key={area.id}>
                  <TableCell className="font-medium">{area.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{area.content}</TableCell>
                  <TableCell>{new Date(area.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Dialog
                      open={isEditDialogOpen && selectedArea?.id === area.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (open) setSelectedArea(area)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Area</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditArea} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="editName">Area Name</Label>
                            <Input
                              id="editName"
                              value={selectedArea?.name || ""}
                              onChange={(e) =>
                                setSelectedArea((prev) => prev ? { ...prev, name: e.target.value } : null)
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="editContent">Content</Label>
                            <textarea
                              id="editContent"
                              className="w-full border rounded-md p-2"
                              rows={5}
                              value={selectedArea?.content || ""}
                              onChange={(e) =>
                                setSelectedArea((prev) => prev ? { ...prev, content: e.target.value } : null)
                              }
                              required
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteArea(area.id)}
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
