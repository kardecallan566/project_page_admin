import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Settings, Users, Download, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <img
              src="/modern-admin-dashboard-interface-with-charts-and-d.jpg"
              alt="Admin Panel Dashboard Interface"
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Streamline Your Management with Our <span className="text-accent">Admin Panel</span>
          </h1>

          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto leading-relaxed">
            Efficiently manage your systems, categories, areas, and downloads with our comprehensive admin panel. Built
            for simplicity and power, designed for modern workflows.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-accent" />
              <span className="font-semibold">Secure Access Required</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Default login: <code className="bg-background px-2 py-1 rounded">admin</code> /{" "}
              <code className="bg-background px-2 py-1 rounded">admin123</code>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/admin">Access Admin Panel</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Manage Your Data</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our admin panel provides comprehensive tools for managing all aspects of your system with secure
              authentication
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Systems Management</CardTitle>
                <CardDescription>
                  Organize and manage all your systems with names and links in one centralized location
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Categories Control</CardTitle>
                <CardDescription>
                  Create and manage categories linked to your systems for better organization
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Areas Administration</CardTitle>
                <CardDescription>
                  Manage areas with flexible relationships to both systems and categories
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>File Downloads</CardTitle>
                <CardDescription>
                  Upload and manage downloadable files with organized naming and easy access
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Access your secure admin panel now and start managing your data efficiently
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/admin">Launch Admin Panel</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Admin Panel Application. Built with Next.js and SQLite.</p>
        </div>
      </footer>
    </div>
  )
}
