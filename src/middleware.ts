import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const protectedRoutes = [
  '/admin',
  '/admin/projects',
  '/admin/properties',
  '/admin/settings',
]

const publicAdminRoutes = [
  '/admin/login',
  '/admin/forgot-password',
  '/admin/reset-password',
]

const protectedApiRoutes = [
  '/api/admin/projects',
  '/api/admin/properties',
  '/api/admin/settings',
  '/api/admin/upload',
  '/api/admin/hero-cards',
  '/api/admin/team-members',
  '/api/admin/logout',
]

const publicApiRoutes = [
  '/api/admin/login',
  '/api/admin/session',
  '/api/admin/csrf',
  '/api/admin/forgot-password',
  '/api/admin/reset-password',
  '/api/projects',
  '/api/properties',
  '/api/hero-cards',
  '/api/team-members',
  '/api/settings',
]

const CSRF_PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

const CSRF_EXEMPT_ROUTES = [
  '/api/admin/login',
  '/api/admin/session',
  '/api/admin/csrf',
  '/api/admin/logout',
]

const CSRF_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'csrf-fallback-secret'
)

async function verifyTokenFromRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('session')?.value

  if (!token) {
    return false
  }

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

async function verifyCSRFToken(token: string): Promise<boolean> {
  if (!token) return false

  try {
    await jwtVerify(token, CSRF_SECRET)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  if (publicAdminRoutes.some(route => pathname === route)) {
    const isAuthenticated = await verifyTokenFromRequest(request)
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  if (protectedRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    const isAuthenticated = await verifyTokenFromRequest(request)

    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  if (protectedApiRoutes.some(route => pathname.startsWith(route))) {
    const isAuthenticated = await verifyTokenFromRequest(request)

    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }

    if (CSRF_PROTECTED_METHODS.includes(method)) {
      const isExempt = CSRF_EXEMPT_ROUTES.some(route => pathname.startsWith(route))

      if (!isExempt) {
        const csrfToken = request.headers.get('x-csrf-token')

        if (!csrfToken) {
          return NextResponse.json(
            { error: 'CSRF token missing', message: 'CSRF token is required' },
            { status: 403 }
          )
        }

        const isValidCSRF = await verifyCSRFToken(csrfToken)

        if (!isValidCSRF) {
          return NextResponse.json(
            { error: 'Invalid CSRF token', message: 'CSRF token is invalid or expired' },
            { status: 403 }
          )
        }
      }
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}
