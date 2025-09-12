"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

interface Category {
  id: string
  name: string
  systemId: string
  system: { name: string }
  createdAt: string
}

interface System {
  id: string
  name: string
}

export function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([])
  const [systems, setSystems] = useState<System[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", systemId: "" })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editCategoryName, setEditCategoryName] = useState("")
  const [editCategorySystemId, setEditCategorySystemId] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCategories()
    fetchSystems()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      setError("Failed to fetch categories")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSystems = async () => {
    try {
      const response = await fetch("/api/systems")
      if (response.ok) {
        const data = await response.json()
        setSystems(data)
      }
    } catch (error) {
      setError("Failed to fetch systems")
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!newCategory.name || !newCategory.systemId) {
      setError("Please fill in all fields")
      return
    }
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      })
      if (response.ok) {
        const createdCategory = await response.json()
        setCategories([...categories, createdCategory])
        setNewCategory({ name: "", systemId: "" })
        setIsDialogOpen(false)
      } else {
        setError("Failed to create category")
      }
    } catch (error) {
      setError("An error occurred")
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setCategories(categories.filter((category) => category.id !== id))
      } else {
        setError("Failed to delete category")
      }
    } catch (error) {
      setError("An error occurred")
    }
  }
  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategoryId) return

    try {
      const response = await fetch(`/api/categories/${selectedCategoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editCategoryName,
          systemId: editCategorySystemId,
        }),
      })

      if (response.ok) {
        const updated = await response.json()
        setCategories(categories.map((c) => (c.id === updated.id ? updated : c)))
        setIsEditDialogOpen(false)
      } else {
        setError("Failed to update category")
      }
    } catch (err) {
      setError("An error occurred while updating category")
    }
  }


  if (isLoading) {
    return <div className="text-center py-4">Loading categories...</div>
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All Categories</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new category and assign it to a system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="system">System</Label>
                <Select
                  value={newCategory.systemId}
                  onValueChange={(value) =>
                    setNewCategory({ ...newCategory, systemId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a system" />
                  </SelectTrigger>
                  <SelectContent>
                    {systems.map((system) => (
                      <SelectItem key={system.id} value={system.id}>
                        {system.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Category</Button>
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
              <TableHead>System</TableHead>
              <TableHead>Download</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Edit</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-8"
                >
                  No categories found. Add your first category to get started.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    {category.name}
                  </TableCell>
                  <TableCell>{category.system.name}</TableCell>
                  <TableCell className="font-medium">
                    {category.name}
                  </TableCell>
                  <TableCell>
                    {new Date(category.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Dialog
                      open={isEditDialogOpen && selectedCategoryId === category.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (open) {
                          setSelectedCategoryId(category.id)
                          setEditCategoryName(category.name)
                          setEditCategorySystemId(category.system.id)
                        } else {
                          setSelectedCategoryId(null)
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Category</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditCategory} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="editName">Category Name</Label>
                            <Input
                              id="editName"
                              value={editCategoryName}
                              onChange={(e) => setEditCategoryName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="editSystem">System</Label>
                            <Select
                              value={editCategorySystemId}
                              onValueChange={(val) => setEditCategorySystemId(val)}
                            >
                              <SelectTrigger id="editSystem">
                                <SelectValue placeholder="Select a system" />
                              </SelectTrigger>
                              <SelectContent>
                                {systems.map((s) => (
                                  <SelectItem key={s.id} value={s.id}>
                                    {s.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                      onClick={() => handleDeleteCategory(category.id)}
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