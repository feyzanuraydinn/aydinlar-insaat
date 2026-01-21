import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Public ekip üyelerini getir (auth gerekmez)
export async function GET(req: NextRequest) {
  try {
    const teamMembers = await prisma.contactCard.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ teamMembers })
  } catch (error) {
    console.error('Get public team members error:', error)
    return NextResponse.json(
      { error: 'Ekip üyeleri yüklenemedi' },
      { status: 500 }
    )
  }
}
