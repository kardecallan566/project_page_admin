"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Area {
  id: number
  name: string
  system_id: number | null
  category_id: number | null
  system_name: string | null
  category_name: string | null
  created_at: string
}

interface System {
  id: number
  name: string
  link: string
}

interface Category {
  id: number
  name: string
  system_id: number
  system_name: string
}

export function AreasManagement() {
  const [areas, setAreas] = useState<Area[]>([])
  const [systems, setSystems] = useState<System[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newArea, setNewArea] = useState({ name: "", systemId: "0", categoryId: "0" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [areasResponse, systemsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/areas"),
        fetch("/api/systems"),
        fetch("/api/categories"),
      ])

      if (areasResponse.ok && systemsResponse.ok && categoriesResponse.ok) {
        const [areasData, systemsData, categoriesData] = await Promise.all([
          areasResponse.json(),
          systemsResponse.json(),
          categoriesResponse.json(),
        ])
        setAreas(areasData)
        setSystems(systemsData)
        setCategories(categoriesData)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/areas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newArea.name,
          systemId: newArea.systemId ? Number.parseInt(newArea.systemId) : null,
          categoryId: newArea.categoryId ? Number.parseInt(newArea.categoryId) : null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Area created successfully",
        })
        setNewArea({ name: "", systemId: "0", categoryId: "0" })
        setIsDialogOpen(false)
        fetchData()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create area",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create area",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this area?")) return

    try {
      const response = await fetch(`/api/areas/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Area deleted successfully",
        })
        fetchData()
      } else {
        toast({
          title: "Error",
          description: "Failed to delete area",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete area",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading areas...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Areas ({areas.length})</h3>
          <p className="text-muted-foreground">Manage areas with flexible relationships to systems and categories</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Area
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Area</DialogTitle>
              <DialogDescription>
                Create a new area. You can optionally link it to a system or category.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
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
                  <Label htmlFor="system">Link to System (Optional)</Label>
                  <Select
                    value={newArea.systemId}
                    onValueChange={(value) => setNewArea({ ...newArea, systemId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a system (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No system</SelectItem>
                      {systems.map((system) => (
                        <SelectItem key={system.id} value={system.id.toString()}>
                          {system.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Link to Category (Optional)</Label>
                  <Select
                    value={newArea.categoryId}
                    onValueChange={(value) => setNewArea({ ...newArea, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No category</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name} ({category.system_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Area"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {areas.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No areas found. Create your first area to get started.</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Linked System</TableHead>
                <TableHead>Linked Category</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areas.map((area) => (
                <TableRow key={area.id}>
                  <TableCell className="font-medium">{area.name}</TableCell>
                  <TableCell>
                    {area.system_name ? (
                      <Badge variant="secondary">{area.system_name}</Badge>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {area.category_name ? (
                      <Badge variant="outline">{area.category_name}</Badge>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell>{new Date(area.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(area.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
