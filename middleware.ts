import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if accessing admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow access to login page
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // Check for session cookie
    const session = request.cookies.get("session")

    if (!session) {
      // Redirect to login if no session
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Protect API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const session = request.cookies.get("session")

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
}
