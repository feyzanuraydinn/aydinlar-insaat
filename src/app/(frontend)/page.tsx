"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CardSwap, { Card } from "@/components/frontend/CardSwap";
import Button from "@/components/ui/Button";
import ProjectCard from "@/components/frontend/ProjectCard";
import PropertyCard from "@/components/frontend/PropertyCard";
import DotGridBackground from "@/components/frontend/DotGridBackground";
import { Project, Property } from "@/types";
import { PageSpinner } from "@/components/ui/Spinner";
import AnimatedSection from "@/components/ui/AnimatedSection";

interface HeroCard {
  id: string;
  image: string;
  title: string;
  description: string;
  order: number;
}

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

export default function Home() {
  const [heroCards, setHeroCards] = useState<HeroCard[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [heroRes, settingsRes, projectsRes, propertiesRes] = await Promise.all([
          fetch("/api/hero-cards"),
          fetch("/api/settings"),
          fetch("/api/projects?featured=true&limit=3"),
          fetch("/api/properties?featured=true&limit=3")
        ]);

        if (heroRes.ok) {
          const heroData = await heroRes.json();
          setHeroCards(heroData.heroCards || []);
        }

        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
        }

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData.projects || []);
        }

        if (propertiesRes.ok) {
          const propertiesData = await propertiesRes.json();
          setProperties(propertiesData.properties || []);
        }
      } catch (error) {
        console.error("Data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <PageSpinner />;
  }

  const scrollToNextSection = () => {
    const nextSection = document.getElementById("experience-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const yearsOfExperience = settings?.homePage?.startYear
    ? new Date().getFullYear() - settings.homePage.startYear
    : 30;

  const heroTitle = settings?.homePage?.heroTitle || "Aydınlar İnşaat";
  const heroSubtitle = settings?.homePage?.heroSubtitle || `${yearsOfExperience} YILLIK TECRÜBE`;
  const heroDefinition = settings?.homePage?.heroDefinition || "Sektörde güvenin ve kalitenin adresi. Modern mimari ve ileri teknoloji ile geleceği inşa ediyoruz.";
  const completedProjects = settings?.homePage?.completedProjects || 150;
  const happyCustomers = settings?.homePage?.happyCustomers || 500;

  const aboutDefinition = settings?.aboutPage?.aboutDefinition || `Aydınlar İnşaat, ${settings?.homePage?.startYear || 1994} yılından bu yana faaliyet gösterdiği inşaat sektöründe; endüstriyel tesisler, ticari yapılar ve konut projelerinde uzmanlaşarak Türkiye'nin önde gelen taahhüt firmalarından biri haline gelmiştir.

${yearsOfExperience} yılı aşkın tecrübesiyle, mühendislik gücünü dijital tasarım, proje yönetimi teknolojileri ve ileri imalat teknikleriyle birleştiren firmamız; projelerini zamanında, bütçeye uygun ve uluslararası kalite standartlarında tamamlamaktadır.

Yerel ve global müşterilerine sürdürülebilir, güvenli ve uzun ömürlü yapılar sunmayı amaçlayan Aydınlar İnşaat; kalite, iş güvenliği ve çevre yönetim sistemleri ile süreçlerini sürekli iyileştirmekte, aynı anda birçok şehirde ve farklı ölçeklerde projeleri başarıyla yürütme kapasitesiyle sektörde fark yaratmaktadır.`;

  const defaultHeroCards = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=450&q=80",
      title: "Modern Projeler",
      description: "En iyi malzemelerle güvenli yapılar"
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=450&q=80",
      title: "Uzman Ekip",
      description: "Deneyimli mühendis ve usta kadrosu"
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1519996529937-47d8d630bbf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=450&q=80",
      title: "Kalite Garantisi",
      description: "Uluslararası standartlarda işçilik"
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1541976590-713941681591?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&h=450&q=80",
      title: "Hızlı Teslimat",
      description: "Zamanında proje tamamlama"
    }
  ];

  const displayHeroCards = heroCards.length > 0 ? heroCards : defaultHeroCards;

  return (
    <div className="bg-surface">
      <section className="relative h-[75vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] xl:h-[85vh] overflow-hidden bg-hero">
        <DotGridBackground />

        <div className="absolute inset-0 bg-gradient-to-b from-primary-darker/10 to-primary/10 z-[1]"></div>

        <div className="absolute inset-0 z-[2] flex items-end pb-14 justify-center sm:pb-24 md:pb-20 lg:hidden">
          <CardSwap
            cardDistance={35}
            verticalDistance={40}
            delay={5000}
            pauseOnHover={false}
            width={320}
            height={200}
            className="scale-90 opacity-25 sm:opacity-30 md:opacity-35 sm:scale-115 md:scale-130"
          >
            {displayHeroCards.map((card) => (
              <Card key={card.id} className="overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="object-cover w-full h-full"
                />
              </Card>
            ))}
          </CardSwap>
        </div>

        <div className="container relative z-[10] flex items-center h-full px-6 sm:px-8 md:px-10 lg:px-4 mx-auto">
          <div className="grid items-center w-full grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="text-center text-text-white">
              <AnimatedSection animation="fade-down" duration={800}>
                <h1 className="mb-4 text-3xl font-bold leading-tight sm:mb-6 sm:text-4xl md:text-5xl text-text-white">
                  {heroTitle}
                </h1>
              </AnimatedSection>

              <AnimatedSection animation="fade-right" duration={800} delay={100}>
                <h2 className="mb-4 text-xl font-semibold text-primary-bg-hover sm:mb-6 sm:text-2xl md:text-3xl">
                  {heroSubtitle}
                </h2>
              </AnimatedSection>

              <AnimatedSection animation="fade-right" duration={800} delay={200}>
                <p className="max-w-2xl mx-auto mb-6 text-base leading-relaxed text-primary-bg sm:mb-8 sm:text-lg md:text-xl lg:text-2xl lg:max-w-none">
                  {heroDefinition}
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" duration={800} delay={300}>
                <div className="grid max-w-md grid-cols-3 gap-3 mx-auto mb-6 sm:gap-6 sm:mb-8 lg:max-w-none">
                  <div className="text-center">
                    <div className="mb-1 text-2xl font-bold sm:mb-2 sm:text-3xl text-text-white">
                      {yearsOfExperience}+
                    </div>
                    <div className="text-xs font-medium text-primary-bg-hover sm:text-sm md:text-base">
                      Yıllık Deneyim
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-1 text-2xl font-bold sm:mb-2 sm:text-3xl text-text-white">
                      {completedProjects}+
                    </div>
                    <div className="text-xs font-medium text-primary-bg-hover sm:text-sm md:text-base">
                      Tamamlanan Proje
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="mb-1 text-2xl font-bold sm:mb-2 sm:text-3xl text-text-white">
                      {happyCustomers}+
                    </div>
                    <div className="text-xs font-medium text-primary-bg-hover sm:text-sm md:text-base">
                      Mutlu Müşteri
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" duration={800} delay={400}>
                <div className="flex flex-row justify-center gap-3 sm:gap-4">
                  <Button href="/projects" scaleOnHover>Projeleri Keşfet</Button>
                  <Button href="/contact" scaleOnHover>İletişime Geç</Button>
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection animation="fade-left" duration={800} delay={200} className="relative hidden lg:flex items-center justify-center h-[400px] xl:h-[500px]">
              <CardSwap
                cardDistance={45}
                verticalDistance={50}
                delay={5000}
                pauseOnHover={false}
                width={480}
                height={300}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[15%] xl:-translate-y-[10%] 2xl:-translate-y-[5%] xl:scale-110 2xl:scale-125 z-[1]"
              >
                {displayHeroCards.map((card) => (
                  <Card key={card.id} className="overflow-hidden cursor-pointer">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 xl:p-6 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="mb-1 xl:mb-2 text-lg xl:text-2xl font-bold text-text-white [text-shadow:0_0_8px_rgba(0,0,0,1),2px_2px_4px_rgba(0,0,0,0.9),-1px_-1px_0_rgba(0,0,0,0.5),1px_-1px_0_rgba(0,0,0,0.5),-1px_1px_0_rgba(0,0,0,0.5),1px_1px_0_rgba(0,0,0,0.5)]">
                        {card.title}
                      </h3>
                      <p className="text-sm xl:text-base text-text-white [text-shadow:0_0_4px_rgba(0,0,0,0.8),1px_1px_2px_rgba(0,0,0,0.7)]">{card.description}</p>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </AnimatedSection>
          </div>
        </div>

        <div className="absolute bottom-0 z-20 p-0 m-0 -translate-x-1/2 left-1/2 translate-y-1/5">
          <Button
            variant="scroll"
            onClick={scrollToNextSection}
            aria-label="Scroll to next section"
          />
        </div>
      </section>

      <section id="experience-section" className="py-16 sm:py-20 md:py-28 lg:py-32 xl:py-40">
        <div className="px-4 mx-auto sm:px-6 md:px-8 max-w-7xl lg:px-12 xl:px-16">
          <div className="grid items-center grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="order-2 p-4 bg-surface rounded-lg sm:p-6 md:p-8 lg:order-1">
              <AnimatedSection animation="fade-down" duration={600}>
                <h2 className="mb-4 text-sm font-bold tracking-wide uppercase sm:mb-6 sm:text-base md:text-lg lg:text-xl text-hero-secondary">
                  {yearsOfExperience} YILLIK TECRÜBE İLE SEKTÖRDE GÜVENİN VE KALİTENİN ADRESİ
                </h2>
              </AnimatedSection>

              <AnimatedSection animation="fade-right" duration={600} delay={100}>
                <div className="text-xs leading-relaxed text-text-secondary sm:text-sm md:text-base">
                  <p className="text-justify whitespace-pre-line">
                    {aboutDefinition}
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" duration={600} delay={200}>
                <div className="flex flex-col gap-4 mt-6 sm:gap-6 sm:mt-8 sm:flex-row">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-hero-secondary">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-text-tertiary sm:text-sm">Bizi Arayın</p>
                      <p className="text-sm font-semibold sm:text-base text-hero-secondary">444 91 37</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center flex-shrink-0 rounded-full w-9 h-9 sm:w-10 sm:h-10 bg-hero-secondary">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-text-tertiary sm:text-sm">Bize Yazın</p>
                      <p className="text-xs font-semibold sm:text-sm text-hero-secondary">
                        info@aydinlarinsaat.com
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" duration={600} delay={300}>
                <div className="mt-6 sm:mt-8">
                  <Button rounded={true} variant="link" size="small" href="/about">
                    DEVAMINI OKU
                  </Button>
                </div>
              </AnimatedSection>
            </div>

            <AnimatedSection animation="fade-left" duration={800} delay={100} className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[450px] xl:h-[500px] rounded-lg overflow-hidden order-1 lg:order-2">
              <img
                src={settings?.aboutPage?.aboutImage || "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"}
                alt="İnşaat Vinçleri"
                className="object-cover w-full h-full"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="py-16 bg-surface isolate [contain:layout_style_paint]">
          <div className="container px-4 mx-auto">
            <AnimatedSection animation="fade-down" duration={600}>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-text-heading md:text-4xl">
                  Öne Çıkan Projeler
                </h2>
              </div>
            </AnimatedSection>

            <div className="box-container">
              {projects.map((project, index) => {
                const getAnimation = () => {
                  if (projects.length === 1) return "fade-up";
                  if (projects.length === 2) return index === 0 ? "fade-right" : "fade-left";
                  return index === 0 ? "fade-right" : index === 1 ? "fade-up" : "fade-left";
                };
                return (
                  <AnimatedSection key={project.id} animation={getAnimation()} duration={600} delay={index * 100} className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px]">
                    <ProjectCard project={project} />
                  </AnimatedSection>
                );
              })}
            </div>

            <AnimatedSection animation="fade-up" duration={600} delay={300}>
              <div className="flex justify-center mt-8">
                <Link href="/projects">
                  <Button rounded={true} variant="link">Tüm Projeler</Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {properties.length > 0 && (
        <section className="py-16 bg-surface">
          <div className="container px-4 mx-auto">
            <AnimatedSection animation="fade-down" duration={600}>
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-text-heading md:text-4xl">
                  Öne Çıkan Gayrimenkuller
                </h2>
              </div>
            </AnimatedSection>

            <div className="box-container">
              {properties.map((property, index) => {
                const getAnimation = () => {
                  if (properties.length === 1) return "fade-up";
                  if (properties.length === 2) return index === 0 ? "fade-right" : "fade-left";
                  return index === 0 ? "fade-right" : index === 1 ? "fade-up" : "fade-left";
                };
                return (
                  <AnimatedSection key={property.id} animation={getAnimation()} duration={600} delay={index * 100} className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px]">
                    <PropertyCard property={property} />
                  </AnimatedSection>
                );
              })}
            </div>

            <AnimatedSection animation="fade-up" duration={600} delay={300}>
              <div className="flex justify-center mt-8">
                <Link href="/properties">
                  <Button rounded={true} variant="link">Tüm Gayrimenkuller</Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}
    </div>
  );
}
