import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - List published projects (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    const where: any = {
      publishedAt: { not: null }
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    if (featured === 'true') {
      where.featured = true
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        residentialDetails: true,
        commercialDetails: true
      },
      orderBy: featured === 'true'
        ? { featuredOrder: 'asc' }
        : [
            // Öne çıkarılanları en üste getir (featuredOrder'a göre)
            { featured: 'desc' },
            { featuredOrder: 'asc' },
            { createdAt: 'desc' }
          ],
      ...(limit && { take: parseInt(limit) })
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
