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
import { Plus, Download, Trash2, FileText } from "lucide-react"

interface DownloadItem {
  id: string
  name: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  createdAt: string
}

export function DownloadsTab() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newDownload, setNewDownload] = useState({ name: "", file: null as File | null })
  const [error, setError] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    fetchDownloads()
  }, [])

  const fetchDownloads = async () => {
    try {
      const response = await fetch("/api/downloads")
      if (response.ok) {
        const data = await response.json()
        setDownloads(data)
      }
    } catch (error) {
      setError("Failed to fetch downloads")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setNewDownload({ ...newDownload, file })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handleAddDownload = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsUploading(true)

    if (!newDownload.name || !newDownload.file) {
      setError("Please fill in all fields and select a file")
      setIsUploading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("name", newDownload.name)
      formData.append("file", newDownload.file)

      const response = await fetch("/api/downloads", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const createdDownload = await response.json()
        setDownloads([...downloads, createdDownload])
        setNewDownload({ name: "", file: null })
        setIsDialogOpen(false)
        // Reset file input
        const fileInput = document.getElementById("file") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to upload file")
      }
    } catch (error) {
      setError("An error occurred during upload")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownloadFile = async (id: string, fileName: string) => {
    try {
      const response = await fetch(`/api/downloads/${id}/file`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        setError("Failed to download file")
      }
    } catch (error) {
      setError("An error occurred during download")
    }
  }

  const handleDeleteDownload = async (id: string) => {
    if (!confirm("Are you sure you want to delete this download?")) return

    try {
      const response = await fetch(`/api/downloads/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDownloads(downloads.filter((download) => download.id !== id))
      } else {
        setError("Failed to delete download")
      }
    } catch (error) {
      setError("An error occurred")
    }
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading downloads...</div>
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All Downloads</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Download
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Download</DialogTitle>
              <DialogDescription>Upload a file and give it a name for easy identification.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddDownload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Download Name</Label>
                <Input
                  id="name"
                  value={newDownload.name}
                  onChange={(e) => setNewDownload({ ...newDownload, name: e.target.value })}
                  placeholder="Enter download name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input id="file" type="file" onChange={handleFileChange} required />
                {newDownload.file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {newDownload.file.name} ({formatFileSize(newDownload.file.size)})
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isUploading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload File"}
                </Button>
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
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {downloads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No downloads found. Upload your first file to get started.
                </TableCell>
              </TableRow>
            ) : (
              downloads.map((download) => (
                <TableRow key={download.id}>
                  <TableCell className="font-medium">{download.name}</TableCell>
                  <TableCell className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    {download.fileName}
                  </TableCell>
                  <TableCell>{formatFileSize(download.fileSize)}</TableCell>
                  <TableCell>{download.mimeType}</TableCell>
                  <TableCell>{new Date(download.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadFile(download.id, download.fileName)}
                        className="text-primary hover:text-primary"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDownload(download.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
