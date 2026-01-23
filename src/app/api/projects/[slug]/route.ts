import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    let project = await prisma.project.findFirst({
      where: {
        OR: [
          { slug, publishedAt: { not: null } },
          { id: slug, publishedAt: { not: null } }
        ]
      },
      include: {
        images: {
          orderBy: [
            { isCover: 'desc' },
            { order: 'asc' }
          ]
        },
        residentialDetails: true,
        commercialDetails: true
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}
