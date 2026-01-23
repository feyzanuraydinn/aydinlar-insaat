import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const heroCards = await prisma.heroCard.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ heroCards })
  } catch (error) {
    console.error('Get public hero cards error:', error)
    return NextResponse.json(
      { error: 'Hero kartları yüklenemedi' },
      { status: 500 }
    )
  }
}
