import type { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { RealEstateListingJsonLd } from "@/components/seo/JsonLd"

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>
  children: React.ReactNode
}

async function getProperty(id: string) {
  return prisma.property.findFirst({
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
      },
      landDetails: {
        select: { pricePerSqm: true, area: true }
      }
    }
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const property = await getProperty(id)

  if (!property) {
    return {
      title: "Gayrimenkul Bulunamadı",
      description: "Aradığınız gayrimenkul bulunamadı.",
    }
  }

  const typeLabels: Record<string, string> = {
    RESIDENTIAL: "Konut",
    COMMERCIAL: "Ticari",
    LAND: "Arsa",
  }
  const typeLabel = typeLabels[property.type] || property.type

  const description = property.description
    ? property.description.substring(0, 160)
    : `${property.title} - ${typeLabel}. ${property.location || "Aydınlar İnşaat güvencesiyle."}`
  const imageUrl = property.images?.[0]?.url

  return {
    title: property.title,
    description,
    keywords: [property.title, typeLabel, property.location, "Aydınlar İnşaat", "gayrimenkul", "satılık", "kiralık"].filter(Boolean) as string[],
    openGraph: {
      title: `${property.title} | Aydınlar İnşaat`,
      description,
      type: "article",
      images: imageUrl ? [imageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: property.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: `/properties/${property.slug}`,
    },
  }
}

export default async function PropertyDetailLayout({ children, params }: Props) {
  const { id } = await params
  const property = await getProperty(id)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aydinlarinsaat.com"

  const landPrice = property?.landDetails?.pricePerSqm && property?.landDetails?.area
    ? Number(property.landDetails.pricePerSqm) * Number(property.landDetails.area)
    : undefined
  const priceDecimal = property?.residentialDetails?.price || property?.commercialDetails?.price
  const price = priceDecimal ? Number(priceDecimal) : landPrice
  const imageUrl = property?.images?.[0]?.url

  return (
    <>
      {property && (
        <RealEstateListingJsonLd
          name={property.title}
          description={property.description || `${property.title} - Aydınlar İnşaat`}
          url={`${baseUrl}/properties/${property.slug}`}
          image={imageUrl}
          price={price}
          address={property.location || undefined}
        />
      )}
      {children}
    </>
  )
}
