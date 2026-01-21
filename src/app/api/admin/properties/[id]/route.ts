import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/session'
import { deleteMultipleFromCloudinary } from '@/lib/cloudinary'

// GET - Tek gayrimenkul detayı
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
          orderBy: { order: 'asc' }
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

// PUT - Gayrimenkul güncelle (tam güncelleme)
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

    // Mevcut gayrimenkulu kontrol et
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

    // Slug mantığı:
    // 1. Eğer slug verilmişse ve mevcut slug'dan farklıysa, yeni slug kullan
    // 2. Eğer slug verilmemişse, mevcut slug'ı koru (başlık değişse bile)
    let finalSlug = existingProperty.slug // Varsayılan: mevcut slug'ı koru

    if (slug && slug !== existingProperty.slug) {
      // Kullanıcı manuel olarak slug değiştirmek istiyor
      let baseSlug = slug
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      // Benzersizlik kontrolü (kendi ID'si hariç)
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

    // Gayrimenkul tipine göre güncelle
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

    // Handle image updates - only delete removed images from Cloudinary
    if (images) {
      const oldImages = existingProperty.images
      const newImageUrls = images.map((img: any) => img.url)

      // Find images that were removed (exist in old but not in new)
      const removedImages = oldImages.filter(oldImg => !newImageUrls.includes(oldImg.url))
      const removedPublicIds = removedImages.map(img => img.publicId).filter(Boolean)

      // Only delete removed images from Cloudinary
      if (removedPublicIds.length > 0) {
        await deleteMultipleFromCloudinary(removedPublicIds)
      }

      // Delete all existing image records from database (will recreate with new list)
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

    // Tip değiştiyse eski detayları sil
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

    // Tip bazlı detayları güncelle veya oluştur
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

// PATCH - Kısmi güncelleme (featured durum vb.)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const data = await req.json()

    // Öne çıkarma işlemi için özel mantık
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

      // Öne çıkarma açılıyorsa
      if (data.featured === true) {
        // Mevcut öne çıkarılan gayrimenkulleri al
        const featuredProperties = await prisma.property.findMany({
          where: {
            featured: true,
            id: { not: id }
          },
          orderBy: { featuredOrder: 'asc' }
        })

        // Zaten 3 tane varsa hata döndür
        if (featuredProperties.length >= 3) {
          return NextResponse.json(
            { error: 'En fazla 3 gayrimenkul öne çıkarılabilir' },
            { status: 400 }
          )
        }

        // Eğer sıra belirtilmemişse, boş olan ilk sırayı bul
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

        // Aynı sırada başka gayrimenkul varsa, diğerlerini kaydır
        const existingAtOrder = featuredProperties.find(p => p.featuredOrder === newOrder)
        if (existingAtOrder) {
          // Tüm gayrimenkulleri yeniden sırala
          const propertiesToUpdate = featuredProperties.filter(p => p.featuredOrder && p.featuredOrder >= newOrder)

          for (const p of propertiesToUpdate.reverse()) {
            const nextOrder = (p.featuredOrder || 0) + 1
            if (nextOrder <= 3) {
              await prisma.property.update({
                where: { id: p.id },
                data: { featuredOrder: nextOrder }
              })
            } else {
              // 3'ten büyükse öne çıkarmayı kaldır
              await prisma.property.update({
                where: { id: p.id },
                data: { featured: false, featuredOrder: null }
              })
            }
          }
        }

        data.featuredOrder = newOrder
      }

      // Sadece sıra değişiyorsa (featured zaten true)
      if (data.featured === undefined && data.featuredOrder !== undefined && currentProperty.featured) {
        const targetOrder = data.featuredOrder
        const currentOrder = currentProperty.featuredOrder

        if (targetOrder !== currentOrder) {
          // Hedef sırada başka gayrimenkul var mı?
          const propertyAtTarget = await prisma.property.findFirst({
            where: {
              featured: true,
              featuredOrder: targetOrder,
              id: { not: id }
            }
          })

          if (propertyAtTarget) {
            // Swap yap veya kaydır
            if (currentOrder) {
              // Swap
              await prisma.property.update({
                where: { id: propertyAtTarget.id },
                data: { featuredOrder: currentOrder }
              })
            } else {
              // Kaydır
              const allFeatured = await prisma.property.findMany({
                where: {
                  featured: true,
                  id: { not: id }
                },
                orderBy: { featuredOrder: 'asc' }
              })

              // Hedef sıradan sonrakileri bir kaydır
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

      // Öne çıkarma kapatılıyorsa
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

    // Güncel tüm gayrimenkulleri döndür (frontend'in güncellenmesi için)
    const allProperties = await prisma.property.findMany({
      include: {
        images: { orderBy: { order: 'asc' } },
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

// DELETE - Delete property
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params

    // Get images first
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

    // Delete images from Cloudinary
    const publicIds = property.images.map(img => img.publicId)
    await deleteMultipleFromCloudinary(publicIds)

    // Delete property (images will be cascade deleted)
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
