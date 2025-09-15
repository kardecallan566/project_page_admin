"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, ExternalLink, Trash2, Pencil } from "lucide-react"

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

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedSystem, setSelectedSystem] = useState<System | null>(null)

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
    } catch {
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
        headers: { "Content-Type": "application/json" },
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
    } catch {
      setError("An error occurred")
    }
  }

  const handleDeleteSystem = async (id: string) => {
    if (!confirm("Tem certeza de que deseja excluir este sistema?")) return

    try {
      const response = await fetch(`/api/systems/${id}`, { method: "DELETE" })
      if (response.ok) setSystems(systems.filter((s) => s.id !== id))
      else setError("Failed to delete system")
    } catch {
      setError("An error occurred")
    }
  }

  const handleEditSystem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSystem) return

    try {
      const response = await fetch(`/api/systems/${selectedSystem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: selectedSystem.name, link: selectedSystem.link }),
      })
      if (response.ok) {
        const updatedSystem = await response.json()
        setSystems(systems.map((s) => (s.id === updatedSystem.id ? updatedSystem : s)))
        setIsEditDialogOpen(false)
        setSelectedSystem(null)
      } else setError("Failed to update system")
    } catch {
      setError("An error occurred while updating system")
    }
  }

  if (isLoading) return <div className="text-center py-4">Carregando sistemas...</div>

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Add System Dialog */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Todos os Sistemas</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Sistema
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar novo Sistema</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddSystem} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Sistema</Label>
                <Input
                  id="name"
                  value={newSystem.name}
                  onChange={(e) => setNewSystem({ ...newSystem, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Link do Sistema</Label>
                <Input
                  id="link"
                  type="url"
                  value={newSystem.link}
                  onChange={(e) => setNewSystem({ ...newSystem, link: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Criar Sistema</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Criado</TableHead>
              <TableHead className="w-[100px]">Editar</TableHead>
              <TableHead className="w-[120px]">Deletar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {systems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Nenhum sistema encontrado. Adicione seu primeiro sistema para começar.
                </TableCell>
              </TableRow>
            ) : (
              systems.map((system) => (
                <TableRow key={system.id}>
                  <TableCell className="font-medium">{system.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    <a
                      href={system.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {system.link}
                    </a>
                  </TableCell>
                  <TableCell>{new Date(system.createdAt).toLocaleDateString()}</TableCell>

                  {/* Edit Column */}
                  <TableCell>
                    <Dialog
                      open={isEditDialogOpen && selectedSystem?.id === system.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (open) setSelectedSystem(system)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar Sistema</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSystem} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="editName">Nome do Sistema</Label>
                            <Input
                              id="editName"
                              value={selectedSystem?.name || ""}
                              onChange={(e) =>
                                setSelectedSystem((prev) => (prev ? { ...prev, name: e.target.value } : null))
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="editLink">Link do Sistema</Label>
                            <Input
                              id="editLink"
                              type="url"
                              value={selectedSystem?.link || ""}
                              onChange={(e) =>
                                setSelectedSystem((prev) => (prev ? { ...prev, link: e.target.value } : null))
                              }
                              required
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                              Cancelar
                            </Button>
                            <Button type="submit">Salvar</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </TableCell>

                  {/* Delete Column */}
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
