import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const CSRF_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'csrf-fallback-secret'
)
const CSRF_TOKEN_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'

export async function generateCSRFToken(): Promise<string> {
  const token = await new SignJWT({ type: 'csrf' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(CSRF_SECRET)

  return token
}

export async function setCSRFCookie(): Promise<string> {
  const token = await generateCSRFToken()
  const cookieStore = await cookies()

  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60,
    path: '/',
  })

  return token
}

export async function verifyCSRFToken(token: string): Promise<boolean> {
  if (!token) return false

  try {
    await jwtVerify(token, CSRF_SECRET)
    return true
  } catch {
    return false
  }
}

export async function validateCSRFFromRequest(request: Request): Promise<boolean> {
  const headerToken = request.headers.get(CSRF_HEADER_NAME)

  if (!headerToken) {
    return false
  }

  return verifyCSRFToken(headerToken)
}

export const CSRF_PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

export const CSRF_EXEMPT_ROUTES = [
  '/api/admin/login',
  '/api/admin/session',
]

export { CSRF_TOKEN_NAME, CSRF_HEADER_NAME }
