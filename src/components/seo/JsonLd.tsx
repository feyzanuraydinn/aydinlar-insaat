// Organization Schema - Şirket bilgileri için
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Aydınlar İnşaat",
    alternateName: "Aydınlar İnşaat A.Ş.",
    url: "https://aydinlarinsaat.com",
    logo: "https://aydinlarinsaat.com/logo.png",
    description: "30 yıllık tecrübesiyle konut projeleri, ticari yapılar ve endüstriyel tesislerde Türkiye'nin güvenilir inşaat firması.",
    foundingDate: "1994",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 50,
      maxValue: 200,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kocaeli",
      addressRegion: "Kocaeli",
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+90-444-91-37",
      contactType: "customer service",
      availableLanguage: "Turkish",
    },
    sameAs: [
      // Sosyal medya hesapları varsa eklenebilir
    ],
    areaServed: {
      "@type": "Country",
      name: "Turkey",
    },
    knowsAbout: [
      "İnşaat",
      "Konut Projeleri",
      "Ticari Yapılar",
      "Endüstriyel Tesisler",
      "Gayrimenkul",
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// LocalBusiness Schema - Yerel işletme için
export function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: "Aydınlar İnşaat",
    image: "https://aydinlarinsaat.com/logo.png",
    url: "https://aydinlarinsaat.com",
    telephone: "+90-444-91-37",
    email: "info@aydinlarinsaat.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kocaeli",
      addressRegion: "Kocaeli",
      postalCode: "41000",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.7650,
      longitude: 29.9400,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "$$$$",
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// WebSite Schema - Site geneli arama için
export function WebsiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Aydınlar İnşaat",
    url: "https://aydinlarinsaat.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://aydinlarinsaat.com/projects?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// BreadcrumbList Schema - Sayfa yolu için
interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// RealEstateListing Schema - Gayrimenkul ilanları için
interface RealEstateListingProps {
  name: string
  description: string
  url: string
  image?: string
  price?: number
  priceCurrency?: string
  address?: string
}

export function RealEstateListingJsonLd({
  name,
  description,
  url,
  image,
  price,
  priceCurrency = "TRY",
  address,
}: RealEstateListingProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name,
    description,
    url,
    ...(image && { image }),
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency,
      },
    }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        addressLocality: address,
        addressCountry: "TR",
      },
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
