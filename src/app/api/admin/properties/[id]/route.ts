import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/session'
import { deleteMultipleFromCloudinary } from '@/lib/cloudinary'
import { generateSlug } from '@/lib/utils'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params

    const property = await prisma.property.findUnique({
      where: { id },
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
      }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Gayrimenkul bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ property })
  } catch (error) {
    console.error('Get property error:', error)
    return NextResponse.json(
      { error: 'Gayrimenkul yüklenemedi' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
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
      slug,
      metaTitle,
      metaDescription,
      images,
      residentialDetails,
      commercialDetails,
      landDetails,
    } = data

    const existingProperty = await prisma.property.findUnique({
      where: { id },
      include: {
        residentialDetails: true,
        commercialDetails: true,
        landDetails: true,
        images: true,
      }
    })

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Gayrimenkul bulunamadı' },
        { status: 404 }
      )
    }

    let finalSlug = existingProperty.slug

    if (slug && slug !== existingProperty.slug) {
      let baseSlug = generateSlug(slug)

      finalSlug = baseSlug
      let counter = 1
      while (await prisma.property.findFirst({
        where: {
          slug: finalSlug,
          id: { not: id }
        }
      })) {
        finalSlug = `${baseSlug}-${counter}`
        counter++
      }
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
      slug: finalSlug,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || description.substring(0, 160),
    }

    if (images) {
      const oldImages = existingProperty.images
      const newImageUrls = images.map((img: any) => img.url)

      const removedImages = oldImages.filter(oldImg => !newImageUrls.includes(oldImg.url))
      const removedPublicIds = removedImages.map(img => img.publicId).filter(Boolean)

      if (removedPublicIds.length > 0) {
        await deleteMultipleFromCloudinary(removedPublicIds)
      }

      await prisma.propertyImage.deleteMany({
        where: { propertyId: id }
      })

      propertyData.images = {
        create: images.map((img: any) => ({
          url: img.url,
          publicId: img.publicId,
          alt: img.alt || title,
          order: img.order || 0,
          isCover: img.isCover || false,
        }))
      }
    }

    if (existingProperty.type !== type) {
      if (existingProperty.residentialDetails) {
        await prisma.residentialProperty.delete({
          where: { propertyId: id }
        })
      }
      if (existingProperty.commercialDetails) {
        await prisma.commercialProperty.delete({
          where: { propertyId: id }
        })
      }
      if (existingProperty.landDetails) {
        await prisma.landProperty.delete({
          where: { propertyId: id }
        })
      }
    }

    if (type === "RESIDENTIAL" && residentialDetails) {
      if (existingProperty.type === "RESIDENTIAL" && existingProperty.residentialDetails) {
        propertyData.residentialDetails = {
          update: residentialDetails
        }
      } else {
        propertyData.residentialDetails = {
          create: residentialDetails
        }
      }
    } else if (type === "COMMERCIAL" && commercialDetails) {
      if (existingProperty.type === "COMMERCIAL" && existingProperty.commercialDetails) {
        propertyData.commercialDetails = {
          update: commercialDetails
        }
      } else {
        propertyData.commercialDetails = {
          create: commercialDetails
        }
      }
    } else if (type === "LAND" && landDetails) {
      if (existingProperty.type === "LAND" && existingProperty.landDetails) {
        propertyData.landDetails = {
          update: landDetails
        }
      } else {
        propertyData.landDetails = {
          create: landDetails
        }
      }
    }

    const property = await prisma.property.update({
      where: { id },
      data: propertyData,
      include: {
        images: true,
        residentialDetails: true,
        commercialDetails: true,
        landDetails: true,
      }
    })

    return NextResponse.json({ property })
  } catch (error: any) {
    console.error('Update property error:', error)
    return NextResponse.json(
      { error: error.message || 'Gayrimenkul güncellenemedi' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const data = await req.json()

    if (data.featured !== undefined || data.featuredOrder !== undefined) {
      const currentProperty = await prisma.property.findUnique({
        where: { id }
      })

      if (!currentProperty) {
        return NextResponse.json(
          { error: 'Gayrimenkul bulunamadı' },
          { status: 404 }
        )
      }

      if (data.featured === true) {
        const featuredProperties = await prisma.property.findMany({
          where: {
            featured: true,
            id: { not: id }
          },
          orderBy: { featuredOrder: 'asc' }
        })

        if (featuredProperties.length >= 3) {
          return NextResponse.json(
            { error: 'En fazla 3 gayrimenkul öne çıkarılabilir' },
            { status: 400 }
          )
        }

        let newOrder = data.featuredOrder
        if (!newOrder) {
          const usedOrders = featuredProperties.map(p => p.featuredOrder).filter(Boolean) as number[]
          for (let i = 1; i <= 3; i++) {
            if (!usedOrders.includes(i)) {
              newOrder = i
              break
            }
          }
        }

        const existingAtOrder = featuredProperties.find(p => p.featuredOrder === newOrder)
        if (existingAtOrder) {
          const propertiesToUpdate = featuredProperties.filter(p => p.featuredOrder && p.featuredOrder >= newOrder)

          for (const p of propertiesToUpdate.reverse()) {
            const nextOrder = (p.featuredOrder || 0) + 1
            if (nextOrder <= 3) {
              await prisma.property.update({
                where: { id: p.id },
                data: { featuredOrder: nextOrder }
              })
            } else {
              await prisma.property.update({
                where: { id: p.id },
                data: { featured: false, featuredOrder: null }
              })
            }
          }
        }

        data.featuredOrder = newOrder
      }

      if (data.featured === undefined && data.featuredOrder !== undefined && currentProperty.featured) {
        const targetOrder = data.featuredOrder
        const currentOrder = currentProperty.featuredOrder

        if (targetOrder !== currentOrder) {
          const propertyAtTarget = await prisma.property.findFirst({
            where: {
              featured: true,
              featuredOrder: targetOrder,
              id: { not: id }
            }
          })

          if (propertyAtTarget) {
            if (currentOrder) {
              await prisma.property.update({
                where: { id: propertyAtTarget.id },
                data: { featuredOrder: currentOrder }
              })
            } else {
              const allFeatured = await prisma.property.findMany({
                where: {
                  featured: true,
                  id: { not: id }
                },
                orderBy: { featuredOrder: 'asc' }
              })

              for (const p of allFeatured.reverse()) {
                if (p.featuredOrder && p.featuredOrder >= targetOrder) {
                  const nextOrder = p.featuredOrder + 1
                  if (nextOrder <= 3) {
                    await prisma.property.update({
                      where: { id: p.id },
                      data: { featuredOrder: nextOrder }
                    })
                  } else {
                    await prisma.property.update({
                      where: { id: p.id },
                      data: { featured: false, featuredOrder: null }
                    })
                  }
                }
              }
            }
          }
        }
      }

      if (data.featured === false) {
        data.featuredOrder = null
      }
    }

    const property = await prisma.property.update({
      where: { id },
      data,
      include: {
        images: true,
        residentialDetails: true,
        commercialDetails: true,
        landDetails: true,
      }
    })

    const allProperties = await prisma.property.findMany({
      include: {
        images: { orderBy: [{ isCover: 'desc' }, { order: 'asc' }] },
        residentialDetails: true,
        commercialDetails: true,
        landDetails: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ property, allProperties })
  } catch (error) {
    console.error('Patch property error:', error)
    return NextResponse.json(
      { error: 'Gayrimenkul güncellenemedi' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params

    const property = await prisma.property.findUnique({
      where: { id },
      include: { images: true }
    })

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    const publicIds = property.images.map(img => img.publicId)
    await deleteMultipleFromCloudinary(publicIds)

    await prisma.property.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete property error:', error)
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    )
  }
}
