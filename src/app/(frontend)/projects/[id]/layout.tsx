import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { RealEstateListingJsonLd } from "@/components/seo/JsonLd"

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>
  children: React.ReactNode
}

async function getProject(id: string) {
  return prisma.project.findFirst({
    where: {
      OR: [
        { slug: id },
        { id: id }
      ]
    },
    select: {
      title: true,
      description: true,
      location: true,
      type: true,
      images: true,
      slug: true,
      residentialDetails: {
        select: { price: true }
      },
      commercialDetails: {
        select: { price: true }
      }
    }
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    return {
      title: "Proje Bulunamadı",
      description: "Aradığınız proje bulunamadı.",
    }
  }

  const typeLabel = project.type === "RESIDENTIAL" ? "Konut Projesi" : "Ticari Proje"
  const description = project.description
    ? project.description.substring(0, 160)
    : `${project.title} - ${typeLabel}. ${project.location || "Aydınlar İnşaat güvencesiyle."}`
  const imageUrl = project.images?.[0]?.url

  return {
    title: project.title,
    description,
    keywords: [project.title, typeLabel, project.location, "Aydınlar İnşaat", "inşaat projesi"].filter(Boolean) as string[],
    openGraph: {
      title: `${project.title} | Aydınlar İnşaat`,
      description,
      type: "article",
      images: imageUrl ? [imageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
  }
}

export default async function ProjectDetailLayout({ children, params }: Props) {
  const { id } = await params
  const project = await getProject(id)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aydinlarinsaat.com"
  const priceDecimal = project?.residentialDetails?.price || project?.commercialDetails?.price
  const price = priceDecimal ? Number(priceDecimal) : undefined
  const imageUrl = project?.images?.[0]?.url

  return (
    <>
      {project && (
        <RealEstateListingJsonLd
          name={project.title}
          description={project.description || `${project.title} - Aydınlar İnşaat`}
          url={`${baseUrl}/projects/${project.slug}`}
          image={imageUrl}
          price={price}
          address={project.location || undefined}
        />
      )}
      {children}
    </>
  )
}
