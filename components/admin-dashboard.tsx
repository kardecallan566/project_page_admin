"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SystemsTab } from "@/components/admin/systems-tab"
import { CategoriesTab } from "@/components/admin/categories-tab"
import { AreasTab } from "@/components/admin/areas-tab"
import { DownloadsTab } from "@/components/admin/downloads-tab"
import { LogOut, Settings, Database, FolderTree, MapPin, Download } from "lucide-react"

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("systems")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-card-foreground">Admin Panel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome, {user?.username}</span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Manage your systems, categories, areas, and downloads</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="systems" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Systems</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2">
              <FolderTree className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="areas" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Areas</span>
            </TabsTrigger>
            {/* <TabsTrigger value="downloads" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Downloads</span>
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="systems">
            <Card>
              <CardHeader>
                <CardTitle>Systems Management</CardTitle>
                <CardDescription>Manage all systems in your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <SystemsTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Categories Management</CardTitle>
                <CardDescription>Organize categories within your systems</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoriesTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="areas">
            <Card>
              <CardHeader>
                <CardTitle>Areas Management</CardTitle>
                <CardDescription>Define specific areas within categories</CardDescription>
              </CardHeader>
              <CardContent>
                <AreasTab />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="downloads">
            <Card>
              <CardHeader>
                <CardTitle>Downloads Management</CardTitle>
                <CardDescription>Upload and manage downloadable files</CardDescription>
              </CardHeader>
              <CardContent>
                <DownloadsTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
