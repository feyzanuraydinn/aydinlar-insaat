"use client";

import { useEffect, useState } from "react";
import DotGridBackground from "@/components/frontend/DotGridBackground";
import Button from "@/components/ui/Button";
import Carousel from "@/components/frontend/Carousel";
import { Project } from "@/types";
import { PageSpinner } from "@/components/ui/Spinner";

const labels: Record<string, Record<string, string>> = {
  type: {
    RESIDENTIAL: "Konut Projesi",
    COMMERCIAL: "Ticari Proje",
  },
  propertyType: {
    FOR_SALE: "Satılık",
    FOR_RENT: "Kiralık",
    TRANSFER_SALE: "Devren Satılık",
    TRANSFER_RENT: "Devren Kiralık",
  },
  housingType: {
    DUPLEX: "Dubleks",
    TOP_FLOOR: "Çatı Katı",
    MIDDLE_FLOOR: "Ara Kat",
    MIDDLE_FLOOR_DUPLEX: "Ara Kat Dubleks",
    GARDEN_DUPLEX: "Bahçe Katı Dubleks",
    ROOF_DUPLEX: "Çatı Dubleks",
    FOURPLEX: "Fourlex",
    REVERSE_DUPLEX: "Ters Dubleks",
    TRIPLEX: "Tripleks",
  },
  buildingAge: {
    "0_READY": "0 (Sıfır - Kullanıma Hazır)",
    "0_CONSTRUCTION": "0 (Sıfır - İnşaat Halinde)",
    "1": "1 Yaşında",
    "2": "2 Yaşında",
    "3": "3 Yaşında",
    "4": "4 Yaşında",
    "5": "5 Yaşında",
    "6_10": "6-10 Arası",
    "11_15": "11-15 Arası",
    "16_20": "16-20 Arası",
    "21_25": "21-25 Arası",
    "26_30": "26-30 Arası",
    "31_PLUS": "31 ve Üzeri",
  },
  heating: {
    NONE: "Yok",
    STOVE: "Soba",
    NATURAL_GAS_STOVE: "Doğalgaz Sobası",
    FLOOR_HEATING_SYSTEM: "Yerden Isıtma Sistemi",
    CENTRAL: "Merkezi",
    CENTRAL_METER: "Merkezi (Pay Ölçer)",
    COMBI_NATURAL_GAS: "Kombi (Doğalgaz)",
    COMBI_ELECTRIC: "Kombi (Elektrik)",
    UNDERFLOOR_HEATING: "Yerden Isıtma",
    AIR_CONDITIONING: "Klima",
    FANCOIL: "Fancoil Ünitesi",
    SOLAR_ENERGY: "Güneş Enerjisi",
    ELECTRIC_RADIATOR: "Elektrikli Radyatör",
    GEOTHERMAL: "Jeotermal",
    FIREPLACE: "Şömine",
    VRV: "VRV",
    HEAT_PUMP: "Isı Pompası",
  },
  kitchen: {
    OPEN_AMERICAN: "Açık (Amerikan)",
    CLOSED: "Kapalı",
  },
  parking: {
    OPEN: "Açık Otopark",
    CLOSED: "Kapalı Otopark",
    OPEN_AND_CLOSED: "Açık ve Kapalı Otopark",
    NONE: "Yok",
  },
  usageStatus: {
    EMPTY: "Boş",
    TENANT: "Kiracılı",
    OWNER: "Mal Sahibi",
  },
  deedStatus: {
    CONDOMINIUM: "Kat Mülkiyetli",
    EASEMENT: "Kat İrtifaklı",
    SHARED_DEED: "Hisseli Tapu",
    DETACHED_DEED: "Müstakil Tapu",
    LAND_DEED: "Arsa Tapulu",
    COOPERATIVE_DEED: "Kooperatif Hisseli",
    USUFRUCT: "İntifa Hakkı",
    FOREIGN_DEED: "Yabancı Tapu",
    NO_DEED: "Tapu Yok",
  },
  listedBy: {
    OWNER: "Mal Sahibinden",
    AGENCY: "Emlak Ofisinden",
    CONSTRUCTION_COMPANY: "İnşaat Firmasından",
    BANK: "Bankadan",
  },
  commercialType: {
    SHOP: "Dükkan",
    GAS_STATION: "Akaryakıt İstasyonu",
    WORKSHOP: "Atölye",
    MALL: "AVM",
    KIOSK: "Büfe",
    OFFICE: "Büro / Ofis",
    FARM: "Çiftlik",
    WAREHOUSE: "Depo",
    WEDDING_HALL: "Düğün Salonu",
    POWER_PLANT: "Enerji Santrali",
    FACTORY: "Fabrika",
    GARAGE: "Garaj",
    MANUFACTURING: "İmalathane",
    BUSINESS_CENTER_FLOOR: "İş Hanı Katı",
    CAFE_BAR: "Kafe / Bar",
    CANTEEN: "Kantin",
    BREAKFAST_GARDEN: "Kahvaltı Bahçesi",
    TEA_HOUSE: "Kıraathane",
    FULL_BUILDING: "Komple Bina",
    PARKING: "Otopark",
    CAR_WASH_SALON: "Oto Yıkama Salonu",
    BAKERY: "Pastane / Fırın",
    MARKET_PLACE: "Pazar Yeri",
    PLAZA: "Plaza",
    PLAZA_FLOOR: "Plaza Katı",
    RESTAURANT: "Restoran / Lokanta",
    RESIDENCE_FLOOR: "Rezidans Katı",
    HEALTH_CENTER: "Sağlık Merkezi",
    CINEMA_HALL: "Sinema Salonu",
    SPA: "SPA / Wellness",
    SPORTS_FACILITY: "Spor Tesisi",
    VILLA: "Villa",
    DORMITORY: "Yurt",
  },
  yesNo: {
    YES: "Evet",
    NO: "Hayır",
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

  const formatPrice = (price: number | null | undefined): string | null => {
    if (!price) return null;
    return new Intl.NumberFormat('tr-TR').format(price) + ' TL';
  };

  const formatArea = (area: number | null | undefined): string | null => {
    if (!area) return null;
    return new Intl.NumberFormat('tr-TR').format(area) + ' m2';
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Proje Bulunamadı</h2>
          <Button rounded={true} variant="link" href="/projects">
            Tüm Projelere Dön
          </Button>
        </div>
      </div>
    );
  }

  const hasLocation = project.latitude && project.longitude;

  const details = project.residentialDetails || project.commercialDetails;
  const isResidential = project.type === 'RESIDENTIAL';

  const specs: { label: string; value: string | null }[] = [];

  const typeLabel = getLabel('type', project.type);
  if (typeLabel) {
    specs.push({ label: 'Kategori', value: typeLabel });
  }

  if (details) {
    const propertyType = getLabel('propertyType', details.propertyType);
    if (propertyType) {
      specs.push({ label: 'Emlak Tipi', value: propertyType });
    }

    const price = formatPrice(details.price);
    if (price) {
      specs.push({ label: 'Fiyat', value: price });
    }

    if (isResidential && project.residentialDetails) {
      const rd = project.residentialDetails;

      const grossArea = formatArea(rd.grossArea);
      if (grossArea) {
        specs.push({ label: 'm² (Brüt)', value: grossArea });
      }

      const netArea = formatArea(rd.netArea);
      if (netArea) {
        specs.push({ label: 'm² (Net)', value: netArea });
      }

      if (rd.roomCount) {
        specs.push({ label: 'Oda Sayısı', value: rd.roomCount });
      }

      const housingType = getLabel('housingType', rd.housingType);
      if (housingType) {
        specs.push({ label: 'Konut Tipi', value: housingType });
      }

      const buildingAge = getLabel('buildingAge', rd.buildingAge);
      if (buildingAge) {
        specs.push({ label: 'Bina Yaşı', value: buildingAge });
      }

      if (rd.currentFloor) {
        specs.push({ label: 'Bulunduğu Kat', value: rd.currentFloor });
      }

      if (rd.totalFloors) {
        specs.push({ label: 'Kat Sayısı', value: rd.totalFloors });
      }

      const heating = getLabel('heating', rd.heating);
      if (heating) {
        specs.push({ label: 'Isıtma', value: heating });
      }

      if (rd.bathroomCount && rd.bathroomCount !== 'NONE') {
        specs.push({ label: 'Banyo Sayısı', value: rd.bathroomCount });
      }

      const kitchen = getLabel('kitchen', rd.kitchen);
      if (kitchen) {
        specs.push({ label: 'Mutfak', value: kitchen });
      }

      const balcony = getLabel('yesNo', rd.balcony);
      if (balcony) {
        specs.push({ label: 'Balkon', value: balcony });
      }

      const elevator = getLabel('yesNo', rd.elevator);
      if (elevator) {
        specs.push({ label: 'Asansör', value: elevator });
      }

      const parking = getLabel('parking', rd.parking);
      if (parking) {
        specs.push({ label: 'Otopark', value: parking });
      }

      const furnished = getLabel('yesNo', rd.furnished);
      if (furnished) {
        specs.push({ label: 'Eşyalı', value: furnished });
      }

      const usageStatus = getLabel('usageStatus', rd.usageStatus);
      if (usageStatus) {
        specs.push({ label: 'Kullanım Durumu', value: usageStatus });
      }

      const inComplex = getLabel('yesNo', rd.inComplex);
      if (inComplex) {
        specs.push({ label: 'Site İçerisinde', value: inComplex });
      }

      const mortgageEligible = getLabel('yesNo', rd.mortgageEligible);
      if (mortgageEligible) {
        specs.push({ label: 'Krediye Uygun', value: mortgageEligible });
      }

      const deedStatus = getLabel('deedStatus', rd.deedStatus);
      if (deedStatus) {
        specs.push({ label: 'Tapu Durumu', value: deedStatus });
      }

      const listedBy = getLabel('listedBy', rd.listedBy);
      if (listedBy) {
        specs.push({ label: 'Kimden', value: listedBy });
      }

      const exchange = getLabel('yesNo', rd.exchange);
      if (exchange) {
        specs.push({ label: 'Takas', value: exchange });
      }
    } else if (!isResidential && project.commercialDetails) {
      const cd = project.commercialDetails;

      const commercialType = getLabel('commercialType', cd.commercialType);
      if (commercialType) {
        specs.push({ label: 'Tür', value: commercialType });
      }

      const area = formatArea(cd.area);
      if (area) {
        specs.push({ label: 'Alan', value: area });
      }

      if (cd.roomCount) {
        specs.push({ label: 'Bölüm/Oda Sayısı', value: cd.roomCount });
      }

      const heating = getLabel('heating', cd.heating);
      if (heating) {
        specs.push({ label: 'Isıtma', value: heating });
      }

      const buildingAge = getLabel('buildingAge', cd.buildingAge);
      if (buildingAge) {
        specs.push({ label: 'Bina Yaşı', value: buildingAge });
      }

      const deedStatus = getLabel('deedStatus', cd.deedStatus);
      if (deedStatus) {
        specs.push({ label: 'Tapu Durumu', value: deedStatus });
      }

      const listedBy = getLabel('listedBy', cd.listedBy);
      if (listedBy) {
        specs.push({ label: 'Kimden', value: listedBy });
      }

      const exchange = getLabel('yesNo', cd.exchange);
      if (exchange) {
        specs.push({ label: 'Takas', value: exchange });
      }
    }
  }

  if (project.location) {
    specs.push({ label: 'Lokasyon', value: project.location });
  }

  if (project.year) {
    specs.push({ label: 'Yıl', value: project.year });
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="grid max-w-6xl grid-cols-1 gap-12 mx-auto lg:grid-cols-2">
            <div className="space-y-6 lg:order-2">
              {project.images && project.images.length > 0 && (
                <Carousel
                  images={project.images}
                  height="h-96"
                  showThumbnails={true}
                />
              )}

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

            <div className="space-y-4 lg:order-1">
              {project.description && (
                <div>
                  <h2 className="mb-2 sm:mb-3 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                    Proje Detayları
                  </h2>
                  <p className="mb-4 text-sm sm:text-base leading-relaxed text-gray-600">
                    {project.description}
                  </p>
                </div>
              )}

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
                            spec.label === 'Emlak Tipi' && spec.value === 'Satılık' ? 'text-green-600' :
                            spec.label === 'Emlak Tipi' && spec.value === 'Kiralık' ? 'text-blue-600' :
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

              <div className="pt-4">
                <Button rounded={true}  variant="link" href="/projects" showArrow={true}>
                  Tüm Projeleri Gör
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
