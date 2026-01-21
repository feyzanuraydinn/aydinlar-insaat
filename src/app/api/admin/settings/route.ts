import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/session'

// GET - Tüm ayarları getir
export async function GET(req: NextRequest) {
  try {
    await requireAuth()

    // Tüm settings tablolarını çek
    const [
      homePage,
      aboutPage,
      projectsPage,
      propertiesPage,
      contactPage,
      heroCards,
      contactCards,
      footer
    ] = await Promise.all([
      prisma.homePageSettings.findFirst(),
      prisma.aboutPageSettings.findFirst(),
      prisma.projectsPageSettings.findFirst(),
      prisma.propertiesPageSettings.findFirst(),
      prisma.contactPageSettings.findFirst(),
      prisma.heroCard.findMany({ orderBy: { order: 'asc' } }),
      prisma.contactCard.findMany({ orderBy: { order: 'asc' } }),
      prisma.footerSettings.findFirst()
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
      heroCards,
      contactCards,
      footer
    })
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT - Ayarları güncelle
export async function PUT(req: NextRequest) {
  try {
    await requireAuth()

    const { type, data } = await req.json()

    let result

    switch (type) {
      case 'homePage':
        // İlk kaydı güncelle veya oluştur
        const existing = await prisma.homePageSettings.findFirst()
        if (existing) {
          result = await prisma.homePageSettings.update({
            where: { id: existing.id },
            data
          })
        } else {
          result = await prisma.homePageSettings.create({ data })
        }
        break

      case 'aboutPage':
        const existingAbout = await prisma.aboutPageSettings.findFirst()
        if (existingAbout) {
          result = await prisma.aboutPageSettings.update({
            where: { id: existingAbout.id },
            data
          })
        } else {
          result = await prisma.aboutPageSettings.create({ data })
        }
        break

      case 'projectsPage':
        const existingProjects = await prisma.projectsPageSettings.findFirst()
        if (existingProjects) {
          result = await prisma.projectsPageSettings.update({
            where: { id: existingProjects.id },
            data
          })
        } else {
          result = await prisma.projectsPageSettings.create({ data })
        }
        break

      case 'propertiesPage':
        const existingProperties = await prisma.propertiesPageSettings.findFirst()
        if (existingProperties) {
          result = await prisma.propertiesPageSettings.update({
            where: { id: existingProperties.id },
            data
          })
        } else {
          result = await prisma.propertiesPageSettings.create({ data })
        }
        break

      case 'contactPage':
        const existingContact = await prisma.contactPageSettings.findFirst()
        // Decimal tipi için dönüşüm yap
        const contactData = {
          contactTitle: data.contactTitle,
          contactTeamDescription: data.contactTeamDescription,
          latitude: data.latitude !== null && data.latitude !== undefined ? parseFloat(String(data.latitude)) : null,
          longitude: data.longitude !== null && data.longitude !== undefined ? parseFloat(String(data.longitude)) : null,
        }
        if (existingContact) {
          result = await prisma.contactPageSettings.update({
            where: { id: existingContact.id },
            data: contactData
          })
        } else {
          result = await prisma.contactPageSettings.create({ data: contactData })
        }
        break

      case 'footer':
        const existingFooter = await prisma.footerSettings.findFirst()
        if (existingFooter) {
          result = await prisma.footerSettings.update({
            where: { id: existingFooter.id },
            data
          })
        } else {
          result = await prisma.footerSettings.create({ data })
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid settings type' },
          { status: 400 }
        )
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
