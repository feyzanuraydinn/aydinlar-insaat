import { Metadata } from 'next';
import { siteConfig, metaDescriptions, pageTitles } from "@/data/site";

export const metadata: Metadata = {
  title: pageTitles.projects,
  description: metaDescriptions.projects,
  keywords: [
    "inşaat projeleri",
    "konut projeleri",
    "ticari yapılar",
    "Kocaeli konut projeleri",
    "İzmit projeleri",
    "Gebze projeleri",
    "Aydınlar İnşaat projeleri",
    "tamamlanan projeler",
    "devam eden projeler",
    "yeni konut projeleri",
    "residence projeleri",
  ],
  openGraph: {
    title: `${pageTitles.projects}`,
    description: metaDescriptions.projects,
    url: `${siteConfig.url}/projects`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: siteConfig.images.ogImage,
        width: 1200,
        height: 630,
        alt: "Aydınlar İnşaat Projeleri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitles.projects}`,
    description: metaDescriptions.projects,
    images: [siteConfig.images.ogImage],
  },
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}