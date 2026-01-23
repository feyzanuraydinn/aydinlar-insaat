import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/session'
import { generateSlug } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    await requireAuth()

    const properties = await prisma.property.findMany({
      include: {
        images: {
          orderBy: [
            { isCover: 'desc' },
            { order: 'asc' }
          ]
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

    let baseSlug = customSlug || generateSlug(title)

    let slug = baseSlug
    let counter = 1
    while (await prisma.property.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

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
