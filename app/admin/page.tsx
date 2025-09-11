"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, FolderTree, MapPin, Download } from "lucide-react"
import { SystemsManagement } from "@/components/systems-management"
import { CategoriesManagement } from "@/components/categories-management"
import { AreasManagement } from "@/components/areas-management"
import { DownloadsManagement } from "@/components/downloads-management"
import { AdminHeader } from "@/components/admin-header"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("systems")

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <AdminHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="systems" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Systems
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderTree className="w-4 h-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="areas" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Areas
            </TabsTrigger>
            <TabsTrigger value="downloads" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Downloads
            </TabsTrigger>
          </TabsList>

          <TabsContent value="systems">
            <Card>
              <CardHeader>
                <CardTitle>Systems Management</CardTitle>
                <CardDescription>
                  Manage all your systems with names and links. Each system can have multiple categories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SystemsManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Categories Management</CardTitle>
                <CardDescription>
                  Organize categories and link them to existing systems for better structure.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoriesManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="areas">
            <Card>
              <CardHeader>
                <CardTitle>Areas Management</CardTitle>
                <CardDescription>
                  Manage areas with flexible relationships to both systems and categories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AreasManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="downloads">
            <Card>
              <CardHeader>
                <CardTitle>Downloads Management</CardTitle>
                <CardDescription>
                  Upload and manage downloadable files with organized naming and easy access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DownloadsManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
