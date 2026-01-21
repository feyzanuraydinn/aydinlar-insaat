import { NextResponse } from 'next/server'
import { setCSRFCookie } from '@/lib/csrf'

/**
 * GET /api/admin/csrf
 * CSRF token al
 * Bu endpoint login sonrası çağrılmalı
 */
export async function GET() {
  try {
    const token = await setCSRFCookie()

    return NextResponse.json({
      success: true,
      token,
    })
  } catch (error) {
    console.error('CSRF token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
