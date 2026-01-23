import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/data/site";
import { BreadcrumbJsonLd, RealEstateListingJsonLd } from "@/components/seo/JsonLd";
import PropertyDetailClient from "./PropertyDetailClient";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

function serializeProperty(property: any) {
  if (!property) return null;

  return {
    ...property,
    latitude: property.latitude ? Number(property.latitude) : null,
    longitude: property.longitude ? Number(property.longitude) : null,
    residentialDetails: property.residentialDetails ? {
      ...property.residentialDetails,
      price: property.residentialDetails.price ? Number(property.residentialDetails.price) : null,
      grossArea: property.residentialDetails.grossArea ? Number(property.residentialDetails.grossArea) : null,
      netArea: property.residentialDetails.netArea ? Number(property.residentialDetails.netArea) : null,
    } : null,
    commercialDetails: property.commercialDetails ? {
      ...property.commercialDetails,
      price: property.commercialDetails.price ? Number(property.commercialDetails.price) : null,
      area: property.commercialDetails.area ? Number(property.commercialDetails.area) : null,
    } : null,
    landDetails: property.landDetails ? {
      ...property.landDetails,
      area: property.landDetails.area ? Number(property.landDetails.area) : null,
      pricePerSqm: property.landDetails.pricePerSqm ? Number(property.landDetails.pricePerSqm) : null,
      floorAreaRatio: property.landDetails.floorAreaRatio ? Number(property.landDetails.floorAreaRatio) : null,
      heightLimit: property.landDetails.heightLimit ? Number(property.landDetails.heightLimit) : null,
    } : null,
  };
}

async function getProperty(id: string) {
  try {
    let property = await prisma.property.findUnique({
      where: { slug: id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        residentialDetails: true,
        commercialDetails: true,
        landDetails: true,
      },
    });

    if (!property) {
      property = await prisma.property.findUnique({
        where: { id },
        include: {
          images: {
            orderBy: { order: "asc" },
          },
          residentialDetails: true,
          commercialDetails: true,
          landDetails: true,
        },
      });
    }

    return serializeProperty(property);
  } catch (error) {
    console.error("Gayrimenkul getirme hatası:", error);
    return null;
  }
}

function getPrice(property: any): number | undefined {
  if (property.residentialDetails?.price) return property.residentialDetails.price;
  if (property.commercialDetails?.price) return property.commercialDetails.price;
  if (property.landDetails?.pricePerSqm && property.landDetails?.area) {
    return property.landDetails.pricePerSqm * property.landDetails.area;
  }
  return undefined;
}

function getTypeLabel(type: string): string {
  switch (type) {
    case "RESIDENTIAL": return "konut";
    case "COMMERCIAL": return "ticari gayrimenkul";
    case "LAND": return "arsa";
    default: return "gayrimenkul";
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return {
      title: "Gayrimenkul Bulunamadı",
      description: "Aradığınız gayrimenkul bulunamadı.",
    };
  }

  const title = property.metaTitle || property.title;
  const description = property.metaDescription || property.description?.substring(0, 160) || `${property.title} - Aydınlar İnşaat gayrimenkul ilanı`;
  const coverImage = property.images?.find((img: { isCover?: boolean; url?: string }) => img.isCover)?.url || property.images?.[0]?.url;
  const price = getPrice(property);
  const typeLabel = getTypeLabel(property.type);

  return {
    title,
    description,
    keywords: [
      property.title,
      property.location || "",
      typeLabel,
      "satılık " + typeLabel,
      "Kocaeli " + typeLabel,
      "Aydınlar İnşaat",
      "gayrimenkul",
      "emlak",
      property.type === "RESIDENTIAL" ? "satılık daire" : "",
      property.type === "RESIDENTIAL" ? "satılık ev" : "",
      property.type === "LAND" ? "satılık arsa" : "",
    ].filter(Boolean),
    openGraph: {
      title: `${title} | Aydınlar İnşaat`,
      description,
      url: `${siteConfig.url}/properties/${property.slug}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "article",
      images: coverImage
        ? [
            {
              url: coverImage,
              width: 1200,
              height: 630,
              alt: property.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Aydınlar İnşaat`,
      description,
      images: coverImage ? [coverImage] : undefined,
    },
    alternates: {
      canonical: `/properties/${property.slug}`,
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Gayrimenkuller", url: `${siteConfig.url}/properties` },
    { name: property.title, url: `${siteConfig.url}/properties/${property.slug}` },
  ];

  const coverImage = property.images?.find((img: { isCover?: boolean; url?: string }) => img.isCover)?.url || property.images?.[0]?.url;
  const price = getPrice(property);

  return (
    <>
      <RealEstateListingJsonLd
        name={property.title}
        description={property.description || ""}
        url={`${siteConfig.url}/properties/${property.slug}`}
        image={coverImage}
        price={price}
        address={property.location || undefined}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <PropertyDetailClient initialProperty={property as any} />
    </>
  );
}
