import Link from "next/link";

interface FooterSettings {
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface FooterProps {
  settings?: FooterSettings | null;
}

export default function Footer({ settings }: FooterProps) {
  const description = settings?.description || "Kaliteli inşaat hizmetleri ve güvenilir gayrimenkul çözümleri.";
  const phone = settings?.phone || "444 91 37";
  const email = settings?.email || "info@aydinlarinsaat.com";
  const address = settings?.address || "Kocaeli, Türkiye";
  const latitude = settings?.latitude;
  const longitude = settings?.longitude;

  const mapsUrl = latitude && longitude
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : `https://www.google.com/maps/search/${encodeURIComponent(address)}`;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-hero">
      <div className="w-full max-w-screen-xl px-4 py-6 mx-auto sm:px-6 lg:px-8 lg:py-10">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-3">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center">
              <img
                src="/logo.svg"
                alt="Aydınlar İnşaat"
                className="w-auto h-10 brightness-0 invert"
              />
            </Link>
            <p className="max-w-sm mt-3 text-sm text-text-white sm:text-base">
              {description}
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase text-text-white sm:text-sm sm:mb-4">
              Hızlı Bağlantılar
            </h2>
            <ul className="space-y-2 text-xs font-medium text-text-white sm:text-sm md:text-base">
              <li>
                <Link href="/about" className="transition-colors hover:text-primary-light">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/projects" className="transition-colors hover:text-primary-light">
                  Projelerimiz
                </Link>
              </li>
              <li>
                <Link href="/properties" className="transition-colors hover:text-primary-light">
                  Gayrimenkul
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-primary-light">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase text-text-white sm:text-sm sm:mb-4">
              İletişim
            </h2>
            <ul className="space-y-2 text-xs font-medium text-text-white sm:text-sm md:text-base">
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center transition-colors hover:text-primary-light"
                >
                  <svg className="flex-shrink-0 w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-start transition-colors hover:text-primary-light"
                >
                  <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span className="break-all">{email}</span>
                </a>
              </li>
              <li>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center transition-colors hover:text-primary-light"
                >
                  <svg className="flex-shrink-0 w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  {address}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-5 border-gray-200/20 lg:my-6" />

        <div className="text-center">
          <span className="text-xs text-text-white sm:text-sm">
            © {currentYear}{" "}
            <Link href="/" className="transition-colors hover:text-primary-light">
              Aydınlar İnşaat™
            </Link>
            . Tüm hakları saklıdır.
          </span>
        </div>
      </div>
    </footer>
  );
}
