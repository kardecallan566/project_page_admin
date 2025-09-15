"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, Pencil } from "lucide-react";
import SimpleWysiwyg from "react-simple-wysiwyg";

interface Area {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

export function AreasTab() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newArea, setNewArea] = useState({ name: "", content: "" });
  const [error, setError] = useState("");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await fetch("/api/areas");
      if (response.ok) {
        const data = await response.json();
        setAreas(data);
      }
    } catch (error) {
      setError("Failed to fetch areas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newArea.name || !newArea.content) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArea),
      });

      if (response.ok) {
        const createdArea = await response.json();
        setAreas([...areas, createdArea]);
        setNewArea({ name: "", content: "" });
        setIsDialogOpen(false);
      } else {
        setError("Failed to create area");
      }
    } catch (error) {
      setError("An error occurred");
    }
  };

  const handleEditArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArea) return;

    try {
      const response = await fetch(`/api/areas/${selectedArea.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedArea),
      });

      if (response.ok) {
        await fetchAreas();
        setIsEditDialogOpen(false);
      } else {
        setError("Failed to update area");
      }
    } catch (error) {
      setError("An error occurred");
    }
  };

  const handleDeleteArea = async (id: string) => {
    if (!confirm("Tem certeza de que deseja excluir esta área?")) return;

    try {
      const response = await fetch(`/api/areas/${id}`, { method: "DELETE" });
      if (response.ok) {
        setAreas(areas.filter((area) => area.id !== id));
      } else {
        setError("Failed to delete area");
      }
    } catch (error) {
      setError("An error occurred");
    }
  };

  if (isLoading) return <div className="text-center py-4">Carregando Áreas...</div>;

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header e botão Add */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Todas as Áreas</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            {/* <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Area
            </Button> */}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] w-full">
            <DialogHeader>
              <DialogTitle>Add New Area</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddArea} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Áreas</Label>
                <select
                  id="name"
                  value={newArea.name}
                  onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select an area</option>
                  <option value="Area 1">Area 1</option>
                  <option value="Area 2">Area 2</option>
                  <option value="Area 3">Area 3</option>
                  {/* Adicione mais opções aqui */}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <SimpleWysiwyg
                  value={newArea.content}
                  onChange={(e) =>
                    setNewArea({ ...newArea, content: e.target.value })
                  }
                  textareaProps={{ style: { width: "100%", minHeight: "150px", padding: "8px" } }}
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

      {/* Tabela */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Criado</TableHead>
              <TableHead>Editar</TableHead>
              {/* <TableHead>Delete</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhuma área encontrada. Adicione sua primeira área para começar.
                </TableCell>
              </TableRow>
            ) : (
              areas.map((area) => (
                <TableRow key={area.id}>
                  <TableCell className="font-medium">{area.name == 'footerTx'?'Rodapé': 'Área inicial'}</TableCell>
                  <TableCell>{new Date(area.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Dialog
                      open={isEditDialogOpen && selectedArea?.id === area.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open);
                        if (open) setSelectedArea(area);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[900px] w-full">
                        <DialogHeader>
                          <DialogTitle>Editar Área</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditArea} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="editName">Nome da Área</Label>
                            <select
                              id="editName"
                              value={selectedArea?.name || ""}
                              onChange={(e) =>
                                setSelectedArea((prev) => (prev ? { ...prev, name: e.target.value } : null))
                              }
                              className="w-full border rounded-md p-2"
                              required
                            >
                              <option value="">Escolha uma Área</option>
                              <option value="footerTx">Rodapé</option>
                              <option value="botdy">Área inicial</option>
                              {/* Adicione mais opções aqui */}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="editContent">Conteúdo</Label>
                            <div style={{ width: "100%" }}>
                              <SimpleWysiwyg
                                value={selectedArea?.content || ""}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                  setSelectedArea((prev) => (prev ? { ...prev, content: e.target.value } : null))
                                }
                              />

                            </div>
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
                  {/* <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteArea(area.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
