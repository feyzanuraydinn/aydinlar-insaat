"use client";

import { useEffect, useState } from "react";
import DotGridBackground from "@/components/frontend/DotGridBackground";
import Button from "@/components/ui/Button";
import Carousel from "@/components/frontend/Carousel";
import { Project } from "@/types";
import { PageSpinner } from "@/components/ui/Spinner";

// Label cevirileri
const labels: Record<string, Record<string, string>> = {
  type: {
    RESIDENTIAL: "Konut Projesi",
    COMMERCIAL: "Ticari Proje",
  },
  propertyType: {
    FOR_SALE: "Satillik",
    FOR_RENT: "Kiralik",
    TRANSFER_SALE: "Devren Satillik",
    TRANSFER_RENT: "Devren Kiralik",
  },
  housingType: {
    DUPLEX: "Dubleks",
    TOP_FLOOR: "Cati Kati",
    MIDDLE_FLOOR: "Ara Kat",
    MIDDLE_FLOOR_DUPLEX: "Ara Kat Dubleks",
    GARDEN_DUPLEX: "Bahce Kati Dubleks",
    ROOF_DUPLEX: "Cati Dubleks",
    FOURPLEX: "Fourlex",
    REVERSE_DUPLEX: "Ters Dubleks",
    TRIPLEX: "Tripleks",
  },
  buildingAge: {
    "0_READY": "0 (Sifir - Kullanima Hazir)",
    "0_CONSTRUCTION": "0 (Sifir - Insaat Halinde)",
    "1": "1 Yasinda",
    "2": "2 Yasinda",
    "3": "3 Yasinda",
    "4": "4 Yasinda",
    "5": "5 Yasinda",
    "6_10": "6-10 Arasi",
    "11_15": "11-15 Arasi",
    "16_20": "16-20 Arasi",
    "21_25": "21-25 Arasi",
    "26_30": "26-30 Arasi",
    "31_PLUS": "31 ve Uzeri",
  },
  heating: {
    NONE: "Yok",
    STOVE: "Soba",
    NATURAL_GAS_STOVE: "Dogalgaz Sobasi",
    FLOOR_HEATING_SYSTEM: "Yerden Isitma Sistemi",
    CENTRAL: "Merkezi",
    CENTRAL_METER: "Merkezi (Pay Olcer)",
    COMBI_NATURAL_GAS: "Kombi (Dogalgaz)",
    COMBI_ELECTRIC: "Kombi (Elektrik)",
    UNDERFLOOR_HEATING: "Yerden Isitma",
    AIR_CONDITIONING: "Klima",
    FANCOIL: "Fancoil Unitesi",
    SOLAR_ENERGY: "Gunes Enerjisi",
    ELECTRIC_RADIATOR: "Elektrikli Radyator",
    GEOTHERMAL: "Jeotermal",
    FIREPLACE: "Somine",
    VRV: "VRV",
    HEAT_PUMP: "Isi Pompasi",
  },
  kitchen: {
    OPEN_AMERICAN: "Acik (Amerikan)",
    CLOSED: "Kapali",
  },
  parking: {
    OPEN: "Acik Otopark",
    CLOSED: "Kapali Otopark",
    OPEN_AND_CLOSED: "Acik ve Kapali Otopark",
    NONE: "Yok",
  },
  usageStatus: {
    EMPTY: "Bos",
    TENANT: "Kiracili",
    OWNER: "Mal Sahibi",
  },
  deedStatus: {
    CONDOMINIUM: "Kat Mulkiyetli",
    EASEMENT: "Kat Irtifakli",
    SHARED_DEED: "Hisseli Tapu",
    DETACHED_DEED: "Mustakil Tapu",
    LAND_DEED: "Arsa Tapulu",
    COOPERATIVE_DEED: "Kooperatif Hisseli",
    USUFRUCT: "Intifa Hakki",
    FOREIGN_DEED: "Yabanci Tapu",
    NO_DEED: "Tapu Yok",
  },
  listedBy: {
    OWNER: "Mal Sahibinden",
    AGENCY: "Emlak Ofisinden",
    CONSTRUCTION_COMPANY: "Insaat Firmasindan",
    BANK: "Bankadan",
  },
  commercialType: {
    SHOP: "Dukkan",
    GAS_STATION: "Akaryakit Istasyonu",
    WORKSHOP: "Atolye",
    MALL: "AVM",
    KIOSK: "Bufe",
    OFFICE: "Buro / Ofis",
    FARM: "Ciftlik",
    WAREHOUSE: "Depo",
    WEDDING_HALL: "Dugun Salonu",
    POWER_PLANT: "Enerji Santrali",
    FACTORY: "Fabrika",
    GARAGE: "Garaj",
    MANUFACTURING: "Imalathane",
    BUSINESS_CENTER_FLOOR: "Is Hani Kati",
    CAFE_BAR: "Kafe / Bar",
    CANTEEN: "Kantin",
    BREAKFAST_GARDEN: "Kahvalti Bahcesi",
    TEA_HOUSE: "Kiraathane",
    FULL_BUILDING: "Komple Bina",
    PARKING: "Otopark",
    CAR_WASH_SALON: "Oto Yikama Salonu",
    BAKERY: "Pastane / Firin",
    MARKET_PLACE: "Pazar Yeri",
    PLAZA: "Plaza",
    PLAZA_FLOOR: "Plaza Kati",
    RESTAURANT: "Restoran / Lokanta",
    RESIDENCE_FLOOR: "Rezidans Kati",
    HEALTH_CENTER: "Saglik Merkezi",
    CINEMA_HALL: "Sinema Salonu",
    SPA: "SPA / Wellness",
    SPORTS_FACILITY: "Spor Tesisi",
    VILLA: "Villa",
    DORMITORY: "Yurt",
  },
  yesNo: {
    YES: "Evet",
    NO: "Hayir",
  },
};

const getLabel = (category: string, value: string | null | undefined): string | null => {
  if (!value) return null;
  return labels[category]?.[value] || value;
};

interface ProjectDetailClientProps {
  initialProject: Project | null;
}

export default function ProjectDetailClient({ initialProject }: ProjectDetailClientProps) {
  const [project] = useState<Project | null>(initialProject);

  // Fiyat formatlama fonksiyonu
  const formatPrice = (price: number | null | undefined): string | null => {
    if (!price) return null;
    return new Intl.NumberFormat('tr-TR').format(price) + ' TL';
  };

  // Alan formatlama fonksiyonu
  const formatArea = (area: number | null | undefined): string | null => {
    if (!area) return null;
    return new Intl.NumberFormat('tr-TR').format(area) + ' m2';
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Proje Bulunamadi</h2>
          <Button rounded={true} variant="link" href="/projects">
            Tum Projelere Don
          </Button>
        </div>
      </div>
    );
  }

  // Harita koordinatlari var mi?
  const hasLocation = project.latitude && project.longitude;

  // Detay bilgilerini al (residential veya commercial)
  const details = project.residentialDetails || project.commercialDetails;
  const isResidential = project.type === 'RESIDENTIAL';

  // Ozellik listesi olustur
  const specs: { label: string; value: string | null }[] = [];

  // Kategori
  const typeLabel = getLabel('type', project.type);
  if (typeLabel) {
    specs.push({ label: 'Kategori', value: typeLabel });
  }

  if (details) {
    // Emlak Tipi
    const propertyType = getLabel('propertyType', details.propertyType);
    if (propertyType) {
      specs.push({ label: 'Emlak Tipi', value: propertyType });
    }

    // Fiyat
    const price = formatPrice(details.price);
    if (price) {
      specs.push({ label: 'Fiyat', value: price });
    }

    if (isResidential && project.residentialDetails) {
      // Residential detaylari
      const rd = project.residentialDetails;

      // m2 (Brut)
      const grossArea = formatArea(rd.grossArea);
      if (grossArea) {
        specs.push({ label: 'm2 (Brut)', value: grossArea });
      }

      // m2 (Net)
      const netArea = formatArea(rd.netArea);
      if (netArea) {
        specs.push({ label: 'm2 (Net)', value: netArea });
      }

      // Oda Sayisi
      if (rd.roomCount) {
        specs.push({ label: 'Oda Sayisi', value: rd.roomCount });
      }

      // Konut Tipi
      const housingType = getLabel('housingType', rd.housingType);
      if (housingType) {
        specs.push({ label: 'Konut Tipi', value: housingType });
      }

      // Bina Yasi
      const buildingAge = getLabel('buildingAge', rd.buildingAge);
      if (buildingAge) {
        specs.push({ label: 'Bina Yasi', value: buildingAge });
      }

      // Bulundugu Kat
      if (rd.currentFloor) {
        specs.push({ label: 'Bulundugu Kat', value: rd.currentFloor });
      }

      // Kat Sayisi
      if (rd.totalFloors) {
        specs.push({ label: 'Kat Sayisi', value: rd.totalFloors });
      }

      // Isitma
      const heating = getLabel('heating', rd.heating);
      if (heating) {
        specs.push({ label: 'Isitma', value: heating });
      }

      // Banyo Sayisi
      if (rd.bathroomCount && rd.bathroomCount !== 'NONE') {
        specs.push({ label: 'Banyo Sayisi', value: rd.bathroomCount });
      }

      // Mutfak
      const kitchen = getLabel('kitchen', rd.kitchen);
      if (kitchen) {
        specs.push({ label: 'Mutfak', value: kitchen });
      }

      // Balkon
      const balcony = getLabel('yesNo', rd.balcony);
      if (balcony) {
        specs.push({ label: 'Balkon', value: balcony });
      }

      // Asansor
      const elevator = getLabel('yesNo', rd.elevator);
      if (elevator) {
        specs.push({ label: 'Asansor', value: elevator });
      }

      // Otopark
      const parking = getLabel('parking', rd.parking);
      if (parking) {
        specs.push({ label: 'Otopark', value: parking });
      }

      // Esyali
      const furnished = getLabel('yesNo', rd.furnished);
      if (furnished) {
        specs.push({ label: 'Esyali', value: furnished });
      }

      // Kullanim Durumu
      const usageStatus = getLabel('usageStatus', rd.usageStatus);
      if (usageStatus) {
        specs.push({ label: 'Kullanim Durumu', value: usageStatus });
      }

      // Site Icerisinde
      const inComplex = getLabel('yesNo', rd.inComplex);
      if (inComplex) {
        specs.push({ label: 'Site Icerisinde', value: inComplex });
      }

      // Krediye Uygunluk
      const mortgageEligible = getLabel('yesNo', rd.mortgageEligible);
      if (mortgageEligible) {
        specs.push({ label: 'Krediye Uygun', value: mortgageEligible });
      }

      // Tapu Durumu
      const deedStatus = getLabel('deedStatus', rd.deedStatus);
      if (deedStatus) {
        specs.push({ label: 'Tapu Durumu', value: deedStatus });
      }

      // Kimden
      const listedBy = getLabel('listedBy', rd.listedBy);
      if (listedBy) {
        specs.push({ label: 'Kimden', value: listedBy });
      }

      // Takas
      const exchange = getLabel('yesNo', rd.exchange);
      if (exchange) {
        specs.push({ label: 'Takas', value: exchange });
      }
    } else if (!isResidential && project.commercialDetails) {
      // Commercial detaylari
      const cd = project.commercialDetails;

      // Ticari Tur
      const commercialType = getLabel('commercialType', cd.commercialType);
      if (commercialType) {
        specs.push({ label: 'Tur', value: commercialType });
      }

      // m2
      const area = formatArea(cd.area);
      if (area) {
        specs.push({ label: 'Alan', value: area });
      }

      // Oda Sayisi
      if (cd.roomCount) {
        specs.push({ label: 'Bolum/Oda Sayisi', value: cd.roomCount });
      }

      // Isitma
      const heating = getLabel('heating', cd.heating);
      if (heating) {
        specs.push({ label: 'Isitma', value: heating });
      }

      // Bina Yasi
      const buildingAge = getLabel('buildingAge', cd.buildingAge);
      if (buildingAge) {
        specs.push({ label: 'Bina Yasi', value: buildingAge });
      }

      // Tapu Durumu
      const deedStatus = getLabel('deedStatus', cd.deedStatus);
      if (deedStatus) {
        specs.push({ label: 'Tapu Durumu', value: deedStatus });
      }

      // Kimden
      const listedBy = getLabel('listedBy', cd.listedBy);
      if (listedBy) {
        specs.push({ label: 'Kimden', value: listedBy });
      }

      // Takas
      const exchange = getLabel('yesNo', cd.exchange);
      if (exchange) {
        specs.push({ label: 'Takas', value: exchange });
      }
    }
  }

  // Lokasyon
  if (project.location) {
    specs.push({ label: 'Lokasyon', value: project.location });
  }

  // Yil
  if (project.year) {
    specs.push({ label: 'Yil', value: project.year });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20 overflow-hidden bg-hero">
        <DotGridBackground />

        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-6xl mx-auto text-center text-text-white">
            <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-text-white">
              {project.title}
            </h1>
            {project.location && (
              <p className="mb-2 text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100">
                {project.location}
              </p>
            )}
            {project.year && (
              <p className="text-sm sm:text-base md:text-lg text-blue-200">
                {project.year}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Project Details Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid max-w-6xl grid-cols-1 gap-12 mx-auto lg:grid-cols-2">
            {/* Image Carousel & Map - First on Mobile, Right on Desktop */}
            <div className="space-y-6 lg:order-2">
              {project.images && project.images.length > 0 && (
                <Carousel
                  images={project.images}
                  height="h-96"
                  showThumbnails={true}
                />
              )}

              {/* Harita - Konum varsa goster */}
              {hasLocation && (
                <div className="p-4 sm:p-6 bg-gray-50 rounded-xl">
                  <h4 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-gray-800">Proje Konumu</h4>
                  {project.location && (
                    <p className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-600">{project.location}</p>
                  )}
                  <div className="h-40 sm:h-48 md:h-56 overflow-hidden rounded-lg">
                    <iframe
                      src={`https://www.google.com/maps?q=${project.latitude},${project.longitude}&z=15&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Project Details - Second on Mobile, Left on Desktop */}
            <div className="space-y-4 lg:order-1">
              {project.description && (
                <div>
                  <h2 className="mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                    Proje Detaylari
                  </h2>
                  <p className="mb-4 text-sm sm:text-base leading-relaxed text-gray-600">
                    {project.description}
                  </p>
                </div>
              )}

              {/* Project Specifications */}
              {specs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">Proje Bilgileri</h3>

                  <div className="grid grid-cols-2 gap-2">
                    {specs.map((spec, index) => (
                      spec.value && (
                        <div key={index} className="px-3 py-2 rounded-lg bg-gray-50">
                          <p className="text-xs text-gray-500">{spec.label}</p>
                          <p className={`text-sm font-semibold ${
                            spec.label === 'Fiyat' ? 'text-green-600' :
                            spec.label === 'Emlak Tipi' && spec.value === 'Satillik' ? 'text-green-600' :
                            spec.label === 'Emlak Tipi' && spec.value === 'Kiralik' ? 'text-blue-600' :
                            'text-gray-800'
                          }`}>
                            {spec.value}
                          </p>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Back to Projects Button */}
              <div className="pt-4">
                <Button rounded={true}  variant="link" href="/projects" showArrow={true}>
                  Tum Projeleri Gor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
