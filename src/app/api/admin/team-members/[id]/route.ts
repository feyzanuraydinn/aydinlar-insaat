import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/session'
import { deleteFromCloudinary } from '@/lib/cloudinary'

// GET - Get single team member
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await context.params

    const teamMember = await prisma.contactCard.findUnique({
      where: { id }
    })

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ teamMember })
  } catch (error) {
    console.error('Get team member error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team member' },
      { status: 500 }
    )
  }
}

// PUT - Update team member
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await context.params
    const { name, profession, phone, email, websiteUrl, image, publicId, order } = await req.json()

    // Check if record exists
    const existingMember = await prisma.contactCard.findUnique({
      where: { id }
    })

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    // Delete old image from Cloudinary if image changed
    if (existingMember.publicId && existingMember.image !== image) {
      await deleteFromCloudinary(existingMember.publicId)
    }

    const teamMember = await prisma.contactCard.update({
      where: { id },
      data: {
        name,
        profession,
        phone,
        email,
        websiteUrl,
        image,
        publicId: publicId || null,
        order
      }
    })

    return NextResponse.json({ teamMember })
  } catch (error) {
    console.error('Update team member error:', error)
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

// DELETE - Delete team member
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await context.params

    // Get member first to get publicId
    const existingMember = await prisma.contactCard.findUnique({
      where: { id }
    })

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      )
    }

    // Delete image from Cloudinary
    if (existingMember.publicId) {
      await deleteFromCloudinary(existingMember.publicId)
    }

    await prisma.contactCard.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete team member error:', error)
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    )
  }
}
