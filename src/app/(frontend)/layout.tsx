import React from 'react';
import Header from '@/components/frontend/layout/Header';
import Footer from '@/components/frontend/layout/Footer';
import { prisma } from '@/lib/prisma';

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

    return {
      ...footer,
      latitude: contactPage?.latitude ? Number(contactPage.latitude) : null,
      longitude: contactPage?.longitude ? Number(contactPage.longitude) : null
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
