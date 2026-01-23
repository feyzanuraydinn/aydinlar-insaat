import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const [
      homePage,
      aboutPage,
      projectsPage,
      propertiesPage,
      contactPage,
      footer,
    ] = await Promise.all([
      prisma.homePageSettings.findFirst(),
      prisma.aboutPageSettings.findFirst(),
      prisma.projectsPageSettings.findFirst(),
      prisma.propertiesPageSettings.findFirst(),
      prisma.contactPageSettings.findFirst(),
      prisma.footerSettings.findFirst(),
    ])

    const contactPageFormatted = contactPage ? {
      ...contactPage,
      latitude: contactPage.latitude ? parseFloat(String(contactPage.latitude)) : null,
      longitude: contactPage.longitude ? parseFloat(String(contactPage.longitude)) : null,
    } : null

    return NextResponse.json({
      homePage,
      aboutPage,
      projectsPage,
      propertiesPage,
      contactPage: contactPageFormatted,
      footer,
    })
  } catch (error) {
    console.error('Get public settings error:', error)
    return NextResponse.json(
      { error: 'Ayarlar yüklenemedi' },
      { status: 500 }
    )
  }
}
