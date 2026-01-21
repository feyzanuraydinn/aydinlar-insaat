import type { Metadata } from "next"
import { siteConfig, metaDescriptions, pageTitles } from "@/data/site"

export const metadata: Metadata = {
  title: pageTitles.contact,
  description: metaDescriptions.contact,
  keywords: [
    "Aydınlar İnşaat iletişim",
    "Kocaeli inşaat iletişim",
    "müteahhit telefon",
    "inşaat firması adres",
    "gayrimenkul danışmanlık",
    "proje görüşmesi",
    "İzmit inşaat firması",
    "Gebze müteahhit",
  ],
  openGraph: {
    title: `${pageTitles.contact}`,
    description: metaDescriptions.contact,
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: siteConfig.images.ogImage,
        width: 1200,
        height: 630,
        alt: "Aydınlar İnşaat İletişim",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pageTitles.contact}`,
    description: metaDescriptions.contact,
    images: [siteConfig.images.ogImage],
  },
  alternates: {
    canonical: "/contact",
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
