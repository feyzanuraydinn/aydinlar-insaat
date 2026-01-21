import { Metadata } from 'next';
import { siteConfig, metaDescriptions, pageTitles } from "@/data/site";

export const metadata: Metadata = {
  title: pageTitles.about,
  description: metaDescriptions.about,
  keywords: [
    "Aydınlar İnşaat hakkında",
    "Kocaeli inşaat firması",
    "müteahhit Kocaeli",
    "inşaat şirketi tarihi",
    "güvenilir müteahhit",
    "30 yıllık tecrübe",
    "kaliteli inşaat",
    "vizyon misyon",
    "İzmit inşaat",
    "Gebze inşaat",
  ],
  openGraph: {
    title: `${pageTitles.about}`,
    description: metaDescriptions.about,
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: siteConfig.images.ogImage,
        width: 1200,
        height: 630,
        alt: "Aydınlar İnşaat Hakkında",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitles.about}`,
    description: metaDescriptions.about,
    images: [siteConfig.images.ogImage],
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}