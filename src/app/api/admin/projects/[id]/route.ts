import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/session'
import { Project } from '@prisma/client'
import { deleteMultipleFromCloudinary } from '@/lib/cloudinary'
import { generateSlug } from '@/lib/utils'

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
          orderBy: [
            { isCover: 'desc' },
            { order: 'asc' }
          ]
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

    let slug = existingProject.slug

    if (customSlug && customSlug !== existingProject.slug) {
      let baseSlug = generateSlug(customSlug)

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

    if (images) {
      const oldImages = existingProject.images
      const newImageUrls = images.map((img: any) => img.url)

      const removedImages = oldImages.filter(oldImg => !newImageUrls.includes(oldImg.url))
      const removedPublicIds = removedImages.map(img => img.publicId).filter(Boolean)

      if (removedPublicIds.length > 0) {
        await deleteMultipleFromCloudinary(removedPublicIds)
      }

      await prisma.projectImage.deleteMany({
        where: { projectId: id }
      })
    }

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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params
    const data = await req.json()

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

      if (data.featured === true) {
        const featuredProjects = await prisma.project.findMany({
          where: {
            featured: true,
            id: { not: id }
          },
          orderBy: { featuredOrder: 'asc' }
        })

        if (featuredProjects.length >= 3) {
          return NextResponse.json(
            { error: 'En fazla 3 proje öne çıkarılabilir' },
            { status: 400 }
          )
        }

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

        const existingAtOrder = featuredProjects.find((p: Project) => p.featuredOrder === newOrder)
        if (existingAtOrder) {
          const projectsToUpdate = featuredProjects.filter((p: Project) => p.featuredOrder && p.featuredOrder >= newOrder)

          for (const p of projectsToUpdate.reverse()) {
            const nextOrder = (p.featuredOrder || 0) + 1
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

        data.featuredOrder = newOrder
      }

      if (data.featured === undefined && data.featuredOrder !== undefined && currentProject.featured) {
        const targetOrder = data.featuredOrder
        const currentOrder = currentProject.featuredOrder

        if (targetOrder !== currentOrder) {
          const projectAtTarget = await prisma.project.findFirst({
            where: {
              featured: true,
              featuredOrder: targetOrder,
              id: { not: id }
            }
          })

          if (projectAtTarget) {
            if (currentOrder) {
              await prisma.project.update({
                where: { id: projectAtTarget.id },
                data: { featuredOrder: currentOrder }
              })
            } else {
              const allFeatured = await prisma.project.findMany({
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

    const allProjects = await prisma.project.findMany({
      include: {
        images: { orderBy: [{ isCover: 'desc' }, { order: 'asc' }] },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth()
    const { id } = await params

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

    const publicIds = project.images.map(img => img.publicId)
    await deleteMultipleFromCloudinary(publicIds)

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
