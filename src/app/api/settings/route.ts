import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Public ayarları getir (auth gerekmez)
export async function GET(req: NextRequest) {
  try {
    // Tüm settings tablolarını çek
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

    // Decimal tiplerini number'a dönüştür
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
