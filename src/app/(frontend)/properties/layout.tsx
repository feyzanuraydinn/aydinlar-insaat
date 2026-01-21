import { Metadata } from 'next';
import { siteConfig, metaDescriptions, pageTitles } from "@/data/site";

export const metadata: Metadata = {
  title: pageTitles.properties,
  description: metaDescriptions.properties,
  keywords: [
    "satılık gayrimenkul",
    "kiralık gayrimenkul",
    "Kocaeli satılık daire",
    "Kocaeli satılık ev",
    "İzmit satılık daire",
    "Gebze satılık daire",
    "satılık arsa Kocaeli",
    "ticari gayrimenkul",
    "işyeri",
    "ofis",
    "dükkan",
    "arsa",
    "yatırımlık gayrimenkul",
    "emlak Kocaeli",
  ],
  openGraph: {
    title: `${pageTitles.properties}`,
    description: metaDescriptions.properties,
    url: `${siteConfig.url}/properties`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: siteConfig.images.ogImage,
        width: 1200,
        height: 630,
        alt: "Aydınlar İnşaat Gayrimenkuller",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitles.properties}`,
    description: metaDescriptions.properties,
    images: [siteConfig.images.ogImage],
  },
  alternates: {
    canonical: "/properties",
  },
};

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}