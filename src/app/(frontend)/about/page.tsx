"use client";

import { useState, useEffect } from "react";
import DotGridBackground from "@/components/frontend/DotGridBackground";
import { PageSpinner } from "@/components/ui/Spinner";

interface Settings {
  homePage: {
    heroTitle: string;
    heroSubtitle: string;
    heroDefinition: string;
    startYear: number;
    completedProjects: number;
    happyCustomers: number;
  };
  aboutPage: {
    aboutTitle: string;
    aboutSubtitle: string;
    aboutDefinition: string;
    aboutImage: string;
    vision: string;
    mission: string;
  };
}

export default function AboutPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Settings fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Loading durumunda spinner göster
  if (loading) {
    return <PageSpinner />;
  }

  // Yıllık deneyimi hesapla
  const yearsOfExperience = settings?.homePage?.startYear
    ? new Date().getFullYear() - settings.homePage.startYear
    : 30;

  // Veriler yüklendikten sonraki değerler
  const aboutTitle = settings?.aboutPage?.aboutTitle || "Hakkımızda";
  const aboutSubtitle = settings?.aboutPage?.aboutSubtitle || `${yearsOfExperience} yıllık tecrübemizle inşaat sektöründe güvenin ve kalitenin adresi`;
  const aboutDefinition = settings?.aboutPage?.aboutDefinition || `Aydınlar İnşaat, ${settings?.homePage?.startYear || 1994} yılından bu yana faaliyet gösterdiği inşaat sektöründe; endüstriyel tesisler, ticari yapılar ve konut projelerinde uzmanlaşarak Türkiye'nin önde gelen taahhüt firmalarından biri haline gelmiştir.

${yearsOfExperience} yılı aşkın tecrübesiyle, mühendislik gücünü dijital tasarım, proje yönetimi teknolojileri ve ileri imalat teknikleriyle birleştiren firmamız; projelerini zamanında, bütçeye uygun ve uluslararası kalite standartlarında tamamlamaktadır.

Yerel ve global müşterilerine sürdürülebilir, güvenli ve uzun ömürlü yapılar sunmayı amaçlayan Aydınlar İnşaat; kalite, iş güvenliği ve çevre yönetim sistemleri ile süreçlerini sürekli iyileştirmekte, aynı anda birçok şehirde ve farklı ölçeklerde projeleri başarıyla yürütme kapasitesiyle sektörde fark yaratmaktadır.`;
  const aboutImage = settings?.aboutPage?.aboutImage || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
  const vision = settings?.aboutPage?.vision || "İnşaat sektöründe teknolojiyi en iyi şekilde kullanarak, sürdürülebilir, yenilikçi ve çevreye duyarlı projelerle Türkiye'nin önde gelen inşaat firmalarından biri olmak.";
  const mission = settings?.aboutPage?.mission || "Müşterilerimize en kaliteli hizmeti sunarak, güvenli, ekonomik ve estetik yapılar inşa etmek; çalışanlarımızın gelişimine katkıda bulunmak ve topluma değer katan projelere imza atmak.";
  const completedProjects = settings?.homePage?.completedProjects || 150;
  const happyCustomers = settings?.homePage?.happyCustomers || 500;

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20 overflow-hidden bg-hero">
        {/* DotGrid Background */}
        <DotGridBackground />

        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center text-text-white">
            <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-white">{aboutTitle}</h1>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-primary-bg">
              {aboutSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* İçerik Bölümü */}
      <section className="py-12 sm:py-16 md:py-20 bg-surface">
        <div className="container px-4 mx-auto">
          <div className="grid items-center grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-2">
            {/* Yazılar */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-text-heading">
                {yearsOfExperience} Yıllık Tecrübe ile Geleceği İnşa Ediyoruz
              </h2>

              <div className="space-y-4 text-text-secondary">
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {aboutDefinition}
                </p>
              </div>

              {/* İstatistikler */}
              <div className="grid grid-cols-3 gap-4 pt-4 sm:pt-6">
                <div className="text-center">
                  <div className="mb-1 sm:mb-2 text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                    {yearsOfExperience}+
                  </div>
                  <div className="text-xs sm:text-sm text-text-secondary">Yıllık Deneyim</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 sm:mb-2 text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                    {completedProjects}+
                  </div>
                  <div className="text-xs sm:text-sm text-text-secondary">Tamamlanan Proje</div>
                </div>
                <div className="text-center">
                  <div className="mb-1 sm:mb-2 text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                    {happyCustomers}+
                  </div>
                  <div className="text-xs sm:text-sm text-text-secondary">Mutlu Müşteri</div>
                </div>
              </div>
            </div>

            {/* Fotoğraf */}
            <div className="relative order-first lg:order-last">
              <div className="overflow-hidden rounded-lg shadow-xl">
                <img
                  src={aboutImage}
                  alt="Aydınlar İnşaat Ekibi"
                  className="object-cover w-full h-48 sm:h-64 md:h-80 lg:h-full"
                />
              </div>

              {/* Dekoratif element - Mobilde gizli */}
              <div className="hidden sm:block absolute w-16 h-16 md:w-24 md:h-24 bg-primary rounded-lg -bottom-4 -left-4 md:-bottom-6 md:-left-6 -z-10"></div>
              <div className="hidden sm:block absolute w-12 h-12 md:w-16 md:h-16 bg-primary-lighter rounded-lg -top-4 -right-4 md:-top-6 md:-right-6 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Vizyon & Misyon Bölümü */}
      <section className="py-12 sm:py-16 md:py-20 bg-surface">
        <div className="container px-4 mx-auto">
          <div className="grid max-w-6xl grid-cols-1 gap-6 sm:gap-8 lg:gap-12 mx-auto lg:grid-cols-2">
            {/* Vizyon */}
            <div className="p-5 sm:p-6 md:p-8 transition-all duration-300 transform bg-surface border border-border shadow-md rounded-xl hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 bg-primary-bg-hover rounded-lg">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-text-heading">Vizyonumuz</h3>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-text-secondary">
                {vision}
              </p>
            </div>

            {/* Misyon */}
            <div className="p-5 sm:p-6 md:p-8 transition-all duration-300 transform bg-surface border border-border shadow-md rounded-xl hover:shadow-xl hover:-translate-y-1">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 bg-primary-bg-hover rounded-lg">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-text-heading">Misyonumuz</h3>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-text-secondary">
                {mission}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
