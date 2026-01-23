import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/data/site";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import ProjectDetailClient from "./ProjectDetailClient";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

function serializeProject(project: any) {
  if (!project) return null;

  return {
    ...project,
    latitude: project.latitude ? Number(project.latitude) : null,
    longitude: project.longitude ? Number(project.longitude) : null,
    residentialDetails: project.residentialDetails ? {
      ...project.residentialDetails,
      price: project.residentialDetails.price ? Number(project.residentialDetails.price) : null,
      grossArea: project.residentialDetails.grossArea ? Number(project.residentialDetails.grossArea) : null,
      netArea: project.residentialDetails.netArea ? Number(project.residentialDetails.netArea) : null,
    } : null,
    commercialDetails: project.commercialDetails ? {
      ...project.commercialDetails,
      price: project.commercialDetails.price ? Number(project.commercialDetails.price) : null,
      area: project.commercialDetails.area ? Number(project.commercialDetails.area) : null,
    } : null,
  };
}

async function getProject(id: string) {
  try {
    let project = await prisma.project.findUnique({
      where: { slug: id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        residentialDetails: true,
        commercialDetails: true,
      },
    });

    if (!project) {
      project = await prisma.project.findUnique({
        where: { id },
        include: {
          images: {
            orderBy: { order: "asc" },
          },
          residentialDetails: true,
          commercialDetails: true,
        },
      });
    }

    return serializeProject(project);
  } catch (error) {
    console.error("Proje getirme hatası:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return {
      title: "Proje Bulunamadı",
      description: "Aradığınız proje bulunamadı.",
    };
  }

  const title = project.metaTitle || project.title;
  const description = project.metaDescription || project.description?.substring(0, 160) || `${project.title} - Aydınlar İnşaat projesi`;
  const coverImage = project.images?.find((img: { isCover?: boolean; url?: string }) => img.isCover)?.url || project.images?.[0]?.url;

  return {
    title,
    description,
    keywords: [
      project.title,
      project.location || "",
      project.type === "RESIDENTIAL" ? "konut projesi" : "ticari proje",
      "Aydınlar İnşaat",
      "Kocaeli inşaat",
      "inşaat projesi",
      project.year || "",
    ].filter(Boolean),
    openGraph: {
      title: `${title} | Aydınlar İnşaat`,
      description,
      url: `${siteConfig.url}/projects/${project.slug}`,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "article",
      images: coverImage
        ? [
            {
              url: coverImage,
              width: 1200,
              height: 630,
              alt: project.title,
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
      canonical: `/projects/${project.slug}`,
    },
  };
}

function ProjectJsonLd({ project }: { project: any }) {
  const coverImage = project.images?.find((img: any) => img.isCover)?.url || project.images?.[0]?.url;

  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateProject",
    name: project.title,
    description: project.description,
    url: `${siteConfig.url}/projects/${project.slug}`,
    ...(coverImage && { image: coverImage }),
    ...(project.location && {
      address: {
        "@type": "PostalAddress",
        addressLocality: project.location,
        addressCountry: "TR",
      },
    }),
    ...(project.latitude && project.longitude && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: project.latitude,
        longitude: project.longitude,
      },
    }),
    ...(project.year && { dateCreated: project.year }),
    developer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Ana Sayfa", url: siteConfig.url },
    { name: "Projeler", url: `${siteConfig.url}/projects` },
    { name: project.title, url: `${siteConfig.url}/projects/${project.slug}` },
  ];

  return (
    <>
      <ProjectJsonLd project={project} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <ProjectDetailClient initialProject={project as any} />
    </>
  );
}
