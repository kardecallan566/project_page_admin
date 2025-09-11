"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Plus, Trash2 } from "lucide-react"

interface Area {
  id: string
  name: string
  categoryId: string
  category: {
    name: string
    system: {
      name: string
    }
  }
  createdAt: string
}

interface Category {
  id: string
  name: string
  system: {
    name: string
  }
}

export function AreasTab() {
  const [areas, setAreas] = useState<Area[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newArea, setNewArea] = useState({ name: "", categoryId: "" })
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAreas()
    fetchCategories()
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

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      setError("Failed to fetch categories")
    }
  }

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!newArea.name || !newArea.categoryId) {
      setError("Please fill in all fields")
      return
    }

    try {
      const response = await fetch("/api/areas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newArea),
      })

      if (response.ok) {
        const createdArea = await response.json()
        setAreas([...areas, createdArea])
        setNewArea({ name: "", categoryId: "" })
        setIsDialogOpen(false)
      } else {
        setError("Failed to create area")
      }
    } catch (error) {
      setError("An error occurred")
    }
  }

  const handleDeleteArea = async (id: string) => {
    if (!confirm("Are you sure you want to delete this area?")) return

    try {
      const response = await fetch(`/api/areas/${id}`, {
        method: "DELETE",
      })

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
              <DialogDescription>Create a new area and assign it to a category.</DialogDescription>
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
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newArea.categoryId}
                  onValueChange={(value) => setNewArea({ ...newArea, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} ({category.system.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <TableHead>Category</TableHead>
              <TableHead>System</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
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
                  <TableCell>{area.category.name}</TableCell>
                  <TableCell>{area.category.system.name}</TableCell>
                  <TableCell>{new Date(area.createdAt).toLocaleDateString()}</TableCell>
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
