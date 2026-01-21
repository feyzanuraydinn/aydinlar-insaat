import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/session'

// GET - Tüm gayrimenkulleri listele (admin)
export async function GET(req: NextRequest) {
  try {
    await requireAuth()

    const properties = await prisma.property.findMany({
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        residentialDetails: true,
        commercialDetails: true,
        landDetails: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ properties })
  } catch (error) {
    console.error('Get properties error:', error)
    return NextResponse.json(
      { error: 'Gayrimenkuller yüklenemedi' },
      { status: 500 }
    )
  }
}

// POST - Yeni gayrimenkul oluştur
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
      type,
      featured,
      featuredOrder,
      slug: customSlug,
      metaTitle,
      metaDescription,
      images,
      residentialDetails,
      commercialDetails,
      landDetails,
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
    while (await prisma.property.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Gayrimenkul tipine göre oluştur
    const propertyData: any = {
      title,
      location,
      latitude: latitude || null,
      longitude: longitude || null,
      description,
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
      propertyData.residentialDetails = {
        create: residentialDetails
      }
    } else if (type === "COMMERCIAL" && commercialDetails) {
      propertyData.commercialDetails = {
        create: commercialDetails
      }
    } else if (type === "LAND" && landDetails) {
      propertyData.landDetails = {
        create: landDetails
      }
    }

    const property = await prisma.property.create({
      data: propertyData,
      include: {
        images: true,
        residentialDetails: true,
        commercialDetails: true,
        landDetails: true,
      }
    })

    return NextResponse.json({ property }, { status: 201 })
  } catch (error: any) {
    console.error('Create property error:', error)

    // Prisma validation hatalarını yakala
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Bu slug zaten kullanılıyor', field: error.meta?.target },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Gayrimenkul oluşturulamadı', details: error.toString() },
      { status: 500 }
    )
  }
}
