import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get single property by slug or id (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Önce slug ile ara, bulamazsa id ile ara
    let property = await prisma.property.findFirst({
      where: {
        OR: [
          { slug, publishedAt: { not: null } },
          { id: slug, publishedAt: { not: null } }
        ]
      },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        residentialDetails: true,
        commercialDetails: true,
        landDetails: true
      }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Get property error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    )
  }
}
