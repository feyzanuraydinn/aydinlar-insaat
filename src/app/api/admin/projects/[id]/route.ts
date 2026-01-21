import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/session'
import { Project } from '@prisma/client'
import { deleteMultipleFromCloudinary } from '@/lib/cloudinary'

// GET - Get single project
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' }
        },
        residentialDetails: true,
        commercialDetails: true,
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT - Update project
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

    // Get existing project
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        residentialDetails: true,
        commercialDetails: true,
        images: true,
      }
    })

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Proje bulunamadı' },
        { status: 404 }
      )
    }

    // Slug mantığı:
    // 1. Eğer customSlug verilmişse ve mevcut slug'dan farklıysa, yeni slug kullan
    // 2. Eğer customSlug verilmemişse, mevcut slug'ı koru (başlık değişse bile)
    let slug = existingProject.slug // Varsayılan: mevcut slug'ı koru

    if (customSlug && customSlug !== existingProject.slug) {
      // Kullanıcı manuel olarak slug değiştirmek istiyor
      let baseSlug = customSlug
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
      slug = baseSlug
      let counter = 1
      while (await prisma.project.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
    }

    // Handle image updates - only delete removed images from Cloudinary
    if (images) {
      const oldImages = existingProject.images
      const newImageUrls = images.map((img: any) => img.url)

      // Find images that were removed (exist in old but not in new)
      const removedImages = oldImages.filter(oldImg => !newImageUrls.includes(oldImg.url))
      const removedPublicIds = removedImages.map(img => img.publicId).filter(Boolean)

      // Only delete removed images from Cloudinary
      if (removedPublicIds.length > 0) {
        await deleteMultipleFromCloudinary(removedPublicIds)
      }

      // Delete all existing image records from database (will recreate with new list)
      await prisma.projectImage.deleteMany({
        where: { projectId: id }
      })
    }

    // Project base data
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
    }

    // Handle images with publicId
    if (images) {
      projectData.images = {
        create: images.map((img: any) => ({
          url: img.url,
          publicId: img.publicId,
          alt: img.alt || title,
          order: img.order || 0,
          isCover: img.isCover || false,
        }))
      }
    }

    // Type changed? Delete old details
    if (existingProject.type !== type) {
      if (existingProject.residentialDetails) {
        await prisma.residentialProject.delete({
          where: { projectId: id }
        })
      }
      if (existingProject.commercialDetails) {
        await prisma.commercialProject.delete({
          where: { projectId: id }
        })
      }
    }

    // Handle type-specific details
    if (type === "RESIDENTIAL" && residentialDetails) {
      if (existingProject.type === "RESIDENTIAL" && existingProject.residentialDetails) {
        projectData.residentialDetails = {
          update: residentialDetails
        }
      } else {
        projectData.residentialDetails = {
          create: residentialDetails
        }
      }
    } else if (type === "COMMERCIAL" && commercialDetails) {
      if (existingProject.type === "COMMERCIAL" && existingProject.commercialDetails) {
        projectData.commercialDetails = {
          update: commercialDetails
        }
      } else {
        projectData.commercialDetails = {
          create: commercialDetails
        }
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: projectData,
      include: {
        images: true,
        residentialDetails: true,
        commercialDetails: true,
      }
    })

    return NextResponse.json({ project })
  } catch (error: any) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { error: error.message || 'Proje güncellenemedi' },
      { status: 500 }
    )
  }
}

// PATCH - Partial update (e.g., featured status)
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
      const currentProject = await prisma.project.findUnique({
        where: { id }
      })

      if (!currentProject) {
        return NextResponse.json(
          { error: 'Proje bulunamadı' },
          { status: 404 }
        )
      }

      // Öne çıkarma açılıyorsa
      if (data.featured === true) {
        // Mevcut öne çıkarılan projeleri al
        const featuredProjects = await prisma.project.findMany({
          where: {
            featured: true,
            id: { not: id }
          },
          orderBy: { featuredOrder: 'asc' }
        })

        // Zaten 3 tane varsa hata döndür
        if (featuredProjects.length >= 3) {
          return NextResponse.json(
            { error: 'En fazla 3 proje öne çıkarılabilir' },
            { status: 400 }
          )
        }

        // Eğer sıra belirtilmemişse, boş olan ilk sırayı bul
        let newOrder = data.featuredOrder
        if (!newOrder) {
          const usedOrders = featuredProjects.map((p: Project) => p.featuredOrder).filter(Boolean) as number[]
          for (let i = 1; i <= 3; i++) {
            if (!usedOrders.includes(i)) {
              newOrder = i
              break
            }
          }
        }

        // Aynı sırada başka proje varsa, diğerlerini kaydır
        const existingAtOrder = featuredProjects.find((p: Project) => p.featuredOrder === newOrder)
        if (existingAtOrder) {
          // Tüm projeleri yeniden sırala
          const projectsToUpdate = featuredProjects.filter((p: Project) => p.featuredOrder && p.featuredOrder >= newOrder)

          for (const p of projectsToUpdate.reverse()) {
            const nextOrder = (p.featuredOrder || 0) + 1
            if (nextOrder <= 3) {
              await prisma.project.update({
                where: { id: p.id },
                data: { featuredOrder: nextOrder }
              })
            } else {
              // 3'ten büyükse öne çıkarmayı kaldır
              await prisma.project.update({
                where: { id: p.id },
                data: { featured: false, featuredOrder: null }
              })
            }
          }
        }

        data.featuredOrder = newOrder
      }

      // Sadece sıra değişiyorsa (featured zaten true)
      if (data.featured === undefined && data.featuredOrder !== undefined && currentProject.featured) {
        const targetOrder = data.featuredOrder
        const currentOrder = currentProject.featuredOrder

        if (targetOrder !== currentOrder) {
          // Hedef sırada başka proje var mı?
          const projectAtTarget = await prisma.project.findFirst({
            where: {
              featured: true,
              featuredOrder: targetOrder,
              id: { not: id }
            }
          })

          if (projectAtTarget) {
            // Swap yap veya kaydır
            if (currentOrder) {
              // Swap
              await prisma.project.update({
                where: { id: projectAtTarget.id },
                data: { featuredOrder: currentOrder }
              })
            } else {
              // Kaydır
              const allFeatured = await prisma.project.findMany({
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
                    await prisma.project.update({
                      where: { id: p.id },
                      data: { featuredOrder: nextOrder }
                    })
                  } else {
                    await prisma.project.update({
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

    const project = await prisma.project.update({
      where: { id },
      data,
      include: {
        images: true,
        residentialDetails: true,
        commercialDetails: true,
      }
    })

    // Güncel tüm projeleri döndür (frontend'in güncellenmesi için)
    const allProjects = await prisma.project.findMany({
      include: {
        images: { orderBy: { order: 'asc' } },
        residentialDetails: true,
        commercialDetails: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ project, allProjects })
  } catch (error) {
    console.error('Patch project error:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE - Delete project
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params

    // Önce fotoğrafları al
    const project = await prisma.project.findUnique({
      where: { id },
      include: { images: true }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Cloudinary'den fotoğrafları sil
    const publicIds = project.images.map(img => img.publicId)
    await deleteMultipleFromCloudinary(publicIds)

    // Projeyi sil (cascade ile fotoğraflar da silinecek)
    await prisma.project.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
