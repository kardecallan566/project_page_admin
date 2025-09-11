import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Admin System</h1>
          <Link href="/login">
            <Button variant="outline">Admin Login</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Image */}
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-muted">
            <img src="/modern-admin-dashboard.png" alt="Admin System Dashboard" className="w-full h-full object-cover" />
          </div>

          {/* Hero Text */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Welcome to the Admin System</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              A comprehensive management platform for organizing systems, categories, areas, and downloads. Streamline
              your administrative tasks with our intuitive interface and powerful tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto">
                  Access Admin Panel
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Learn More
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-semibold text-card-foreground mb-2">Systems Management</h3>
              <p className="text-sm text-muted-foreground">
                Organize and manage all your systems with easy-to-use tools.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-semibold text-card-foreground mb-2">Categories</h3>
              <p className="text-sm text-muted-foreground">Create and organize categories within your systems.</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-semibold text-card-foreground mb-2">Areas</h3>
              <p className="text-sm text-muted-foreground">
                Define specific areas within categories for better organization.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-semibold text-card-foreground mb-2">Downloads</h3>
              <p className="text-sm text-muted-foreground">
                Upload and manage files with secure download capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 Admin System. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
