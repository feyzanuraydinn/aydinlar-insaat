import React from 'react';
import Header from '@/components/frontend/layout/Header';
import Footer from '@/components/frontend/layout/Footer';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getLocationAddress(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      { next: { revalidate: 86400 } }
    );
    const data = await response.json();
    const address = data.address;
    const district = address?.town || address?.district || address?.suburb || address?.county;
    const city = address?.city || address?.province || address?.state;
    return [city, district].filter(Boolean).join(', ') || null;
  } catch {
    return null;
  }
}

async function getFooterSettings() {
  try {
    const [footer, contactPage] = await Promise.all([
      prisma.footerSettings.findFirst(),
      prisma.contactPageSettings.findFirst({
        select: {
          latitude: true,
          longitude: true
        }
      })
    ]);

    const lat = contactPage?.latitude ? Number(contactPage.latitude) : null;
    const lng = contactPage?.longitude ? Number(contactPage.longitude) : null;

    let locationAddress: string | null = null;
    if (lat && lng) {
      locationAddress = await getLocationAddress(lat, lng);
    }

    return {
      description: footer?.description || undefined,
      phone: footer?.phone || undefined,
      email: footer?.email || undefined,
      latitude: lat,
      longitude: lng,
      locationAddress
    };
  } catch (error) {
    console.error('Footer settings fetch error:', error);
    return null;
  }
}

export default async function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerSettings = await getFooterSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer settings={footerSettings} />
    </div>
  );
}
