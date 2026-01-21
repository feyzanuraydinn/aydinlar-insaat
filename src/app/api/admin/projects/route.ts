import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/session'

// GET - Tüm projeleri listele (admin)
export async function GET(req: NextRequest) {
  try {
    await requireAuth()

    const projects = await prisma.project.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        residentialDetails: true,
        commercialDetails: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Projeler yüklenemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni proje oluştur
export async function POST(req: NextRequest) {
  try {
    await requireAuth()

    const data = await req.json()
    const {
      title,
      location,
      latitude,
      longitude,
      description,
      year,
      type,
      featured,
      featuredOrder,
      slug: customSlug,
      metaTitle,
      metaDescription,
      images,
      residentialDetails,
      commercialDetails,
    } = data

    // Slug oluştur
    let baseSlug = customSlug || title
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Slug benzersiz mi kontrol et, değilse numara ekle
    let slug = baseSlug
    let counter = 1
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Proje tipine göre oluştur
    const projectData: any = {
      title,
      location,
      latitude: latitude || null,
      longitude: longitude || null,
      description,
      year,
      type,
      featured: featured || false,
      featuredOrder: featured ? featuredOrder : null,
      slug,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || description.substring(0, 160),
      publishedAt: new Date(),
      images: {
        create: images?.map((img: any) => ({
          url: img.url,
          publicId: img.publicId,
          alt: img.alt || title,
          order: img.order || 0,
          isCover: img.isCover || false,
        })) || []
      }
    }

    // Tip bazlı detayları ekle
    if (type === "RESIDENTIAL" && residentialDetails) {
      projectData.residentialDetails = {
        create: residentialDetails
      }
    } else if (type === "COMMERCIAL" && commercialDetails) {
      projectData.commercialDetails = {
        create: commercialDetails
      }
    }

    const project = await prisma.project.create({
      data: projectData,
      include: {
        images: true,
        residentialDetails: true,
        commercialDetails: true,
      }
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error: any) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: error.message || 'Proje oluşturulamadı' },
      { status: 500 }
    )
  }
}
