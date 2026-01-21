import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/session'

// GET - Tüm hero card'ları getir
export async function GET(req: NextRequest) {
  try {
    await requireAuth()

    const heroCards = await prisma.heroCard.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ heroCards })
  } catch (error) {
    console.error('Get hero cards error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero cards' },
      { status: 500 }
    )
  }
}

// POST - Create new hero card
export async function POST(req: NextRequest) {
  try {
    await requireAuth()

    const { image, publicId, title, description, order } = await req.json()

    if (!image || !title || !description || order === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const heroCard = await prisma.heroCard.create({
      data: {
        image,
        ...(publicId && { publicId }),
        title,
        description,
        order
      }
    })

    return NextResponse.json({ heroCard })
  } catch (error) {
    console.error('Create hero card error:', error)
    return NextResponse.json(
      { error: 'Failed to create hero card' },
      { status: 500 }
    )
  }
}
