import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/session'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await context.params

    const heroCard = await prisma.heroCard.findUnique({
      where: { id }
    })

    if (!heroCard) {
      return NextResponse.json(
        { error: 'Hero card not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ heroCard })
  } catch (error) {
    console.error('Get hero card error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hero card' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await context.params
    const { image, publicId, title, description, order } = await req.json()

    const existingCard = await prisma.heroCard.findUnique({
      where: { id }
    })

    if (!existingCard) {
      return NextResponse.json(
        { error: 'Hero card not found' },
        { status: 404 }
      )
    }

    if (existingCard.publicId && existingCard.image !== image) {
      await deleteFromCloudinary(existingCard.publicId)
    }

    const heroCard = await prisma.heroCard.update({
      where: { id },
      data: {
        image,
        publicId: publicId || null,
        title,
        description,
        order
      }
    })

    return NextResponse.json({ heroCard })
  } catch (error) {
    console.error('Update hero card error:', error)
    return NextResponse.json(
      { error: 'Failed to update hero card' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await context.params

    const heroCard = await prisma.heroCard.findUnique({
      where: { id }
    })

    if (!heroCard) {
      return NextResponse.json(
        { error: 'Hero card not found' },
        { status: 404 }
      )
    }

    if (heroCard.publicId) {
      await deleteFromCloudinary(heroCard.publicId)
    }

    await prisma.heroCard.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete hero card error:', error)
    return NextResponse.json(
      { error: 'Failed to delete hero card' },
      { status: 500 }
    )
  }
}
