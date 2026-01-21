import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/data/site";
import { BreadcrumbJsonLd, RealEstateListingJsonLd } from "@/components/seo/JsonLd";
import PropertyDetailClient from "./PropertyDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Gayrimenkul verilerini getir
async function getProperty(id: string) {
  try {
    // Önce slug ile dene
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

    // Slug bulunamazsa ID ile dene
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

    return property;
  } catch (error) {
    console.error("Gayrimenkul getirme hatası:", error);
    return null;
  }
}

// Fiyatı al
function getPrice(property: any): number | undefined {
  if (property.residentialDetails?.price) return property.residentialDetails.price;
  if (property.commercialDetails?.price) return property.commercialDetails.price;
  if (property.landDetails?.pricePerSqm && property.landDetails?.area) {
    return property.landDetails.pricePerSqm * property.landDetails.area;
  }
  return undefined;
}

// Tip etiketi
function getTypeLabel(type: string): string {
  switch (type) {
    case "RESIDENTIAL": return "konut";
    case "COMMERCIAL": return "ticari gayrimenkul";
    case "LAND": return "arsa";
    default: return "gayrimenkul";
  }
}

// Dinamik metadata
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
  const coverImage = property.images?.find((img) => img.isCover)?.url || property.images?.[0]?.url;
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

// Statik sayfalar için slug'ları oluştur
export async function generateStaticParams() {
  try {
    const properties = await prisma.property.findMany({
      select: { slug: true },
    });

    return properties.map((property) => ({
      id: property.slug,
    }));
  } catch (error) {
    console.error("generateStaticParams hatası:", error);
    return [];
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  // Breadcrumb verileri
  const breadcrumbItems = [
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Gayrimenkuller", url: `${siteConfig.url}/properties` },
    { name: property.title, url: `${siteConfig.url}/properties/${property.slug}` },
  ];

  // RealEstateListing verilerini hazırla
  const coverImage = property.images?.find((img) => img.isCover)?.url || property.images?.[0]?.url;
  const price = getPrice(property);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <RealEstateListingJsonLd
        name={property.title}
        description={property.description || ""}
        url={`${siteConfig.url}/properties/${property.slug}`}
        image={coverImage}
        price={price}
        address={property.location || undefined}
      />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      {/* Client Component */}
      <PropertyDetailClient initialProperty={property as any} />
    </>
  );
}
