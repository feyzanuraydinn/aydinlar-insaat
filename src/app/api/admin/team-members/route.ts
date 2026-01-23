import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/session'

export async function GET(req: NextRequest) {
  try {
    await requireAuth()

    const teamMembers = await prisma.contactCard.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ teamMembers })
  } catch (error) {
    console.error('Get team members error:', error)
    return NextResponse.json(
      { error: 'Ekip üyeleri yüklenemedi' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth()

    const { name, profession, phone, email, websiteUrl, image, publicId } = await req.json()

    if (!name || !phone || !email || !image) {
      return NextResponse.json(
        { error: 'Name, phone, email and image are required' },
        { status: 400 }
      )
    }

    const maxOrder = await prisma.contactCard.aggregate({
      _max: { order: true }
    })
    const nextOrder = (maxOrder._max.order ?? -1) + 1

    const teamMember = await prisma.contactCard.create({
      data: {
        name,
        profession,
        phone,
        email,
        websiteUrl,
        image,
        ...(publicId && { publicId }),
        order: nextOrder
      }
    })

    return NextResponse.json({ teamMember })
  } catch (error) {
    console.error('Create team member error:', error)
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}
