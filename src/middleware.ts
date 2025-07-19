import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for token in both cookie and localStorage
  const token = request.cookies.get('adminToken')?.value
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/login'

  // If trying to access admin route without token, redirect to login
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If already logged in and trying to access login page, redirect to admin
  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login']
} 