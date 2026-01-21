import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const CSRF_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'csrf-fallback-secret'
)
const CSRF_TOKEN_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'

/**
 * CSRF token oluştur
 */
export async function generateCSRFToken(): Promise<string> {
  const token = await new SignJWT({ type: 'csrf' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h') // 1 saat geçerli
    .sign(CSRF_SECRET)

  return token
}

/**
 * CSRF token'ı cookie'ye kaydet
 */
export async function setCSRFCookie(): Promise<string> {
  const token = await generateCSRFToken()
  const cookieStore = await cookies()

  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: false, // JavaScript'ten erişilebilir olmalı
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 saat
    path: '/',
  })

  return token
}

/**
 * CSRF token'ı doğrula
 */
export async function verifyCSRFToken(token: string): Promise<boolean> {
  if (!token) return false

  try {
    await jwtVerify(token, CSRF_SECRET)
    return true
  } catch {
    return false
  }
}

/**
 * Request'ten CSRF token'ı al ve doğrula
 */
export async function validateCSRFFromRequest(request: Request): Promise<boolean> {
  // Header'dan token al
  const headerToken = request.headers.get(CSRF_HEADER_NAME)

  if (!headerToken) {
    return false
  }

  return verifyCSRFToken(headerToken)
}

/**
 * CSRF koruması gerektiren methodlar
 */
export const CSRF_PROTECTED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

/**
 * CSRF koruması gerektirmeyen route'lar
 */
export const CSRF_EXEMPT_ROUTES = [
  '/api/admin/login', // Login'de henüz token yok
  '/api/admin/session', // Session kontrolü
]

export { CSRF_TOKEN_NAME, CSRF_HEADER_NAME }
