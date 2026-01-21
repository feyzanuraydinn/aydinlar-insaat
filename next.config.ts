import type { NextConfig } from "next";

// Security headers
const securityHeaders = [
  {
    // XSS saldırılarına karşı koruma
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    // Clickjacking saldırılarına karşı koruma
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    // MIME type sniffing saldırılarına karşı koruma
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    // Referrer bilgisini kontrol et
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    // DNS prefetching kontrolü
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    // HTTPS zorunluluğu (production'da)
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    // İzin verilen kaynakları tanımla
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    // Content Security Policy - XSS ve injection saldırılarına karşı
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://*.supabase.co https://*.tile.openstreetmap.org https://unpkg.com",
      "media-src 'self' https://res.cloudinary.com",
      "connect-src 'self' https://api.cloudinary.com https://*.supabase.co https://nominatim.openstreetmap.org",
      "frame-src 'self' https://www.google.com https://maps.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; ')
  }
];

const nextConfig: NextConfig = {
  // Security headers ekle
  async headers() {
    return [
      {
        // Tüm route'lara uygula
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },

  // Resim domainlerini tanımla
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },

  // Powered by header'ını gizle (güvenlik için)
  poweredByHeader: false,
};

export default nextConfig;
