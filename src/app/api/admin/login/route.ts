import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createToken } from '@/lib/jwt'
import { cookies } from 'next/headers'
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit'
import { loginSchema, formatZodErrors } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const clientIP = getClientIP(req)
    const rateLimitKey = `login:${clientIP}`
    const rateLimit = checkRateLimit(rateLimitKey, RATE_LIMITS.LOGIN)

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Çok fazla giriş denemesi',
          message: `Lütfen ${rateLimit.retryAfter} saniye sonra tekrar deneyin`,
          retryAfter: rateLimit.retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter),
            'X-RateLimit-Limit': String(RATE_LIMITS.LOGIN.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rateLimit.resetTime),
          }
        }
      )
    }

    const body = await req.json()

    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Geçersiz e-posta veya şifre',
          errors: formatZodErrors(validation.error.issues)
        },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Hatalı e-posta veya şifre' },
        { status: 401 }
      )
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return NextResponse.json(
        { error: 'Hatalı e-posta veya şifre' },
        { status: 401 }
      )
    }

    const token = await createToken({ id: user.id, email: user.email })

    const cookieStore = await cookies()
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    })

    response.headers.set('X-RateLimit-Limit', String(RATE_LIMITS.LOGIN.maxRequests))
    response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining))
    response.headers.set('X-RateLimit-Reset', String(rateLimit.resetTime))

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Giriş sırasında bir hata oluştu' },
      { status: 500 }
    )
  }
}
