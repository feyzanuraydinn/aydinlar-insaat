export const COMMON_LABELS = {
  title: 'Başlık',
  description: 'Açıklama',
  location: 'Konum',
  year: 'Yıl',
  images: 'Görseller',
  type: 'Tür',
} as const;

export const RESIDENTIAL_LABELS = {
  price: 'Fiyat',
  propertyType: 'Emlak Tipi',
  grossArea: 'm² (Brüt)',
  netArea: 'm² (Net)',
  roomCount: 'Oda Sayısı',
  housingType: 'Konut Tipi',
  buildingAge: 'Bina Yaşı',
  currentFloor: 'Bulunduğu Kat',
  totalFloors: 'Kat Sayısı',
  heating: 'Isıtma',
  bathroomCount: 'Banyo Sayısı',
  kitchen: 'Mutfak',
  balcony: 'Balkon',
  elevator: 'Asansör',
  parking: 'Otopark',
  furnished: 'Eşyalı',
  usageStatus: 'Kullanım Durumu',
  inComplex: 'Site İçerisinde',
  mortgageEligible: 'Krediye Uygunluk',
  deedStatus: 'Tapu Durumu',
  listedBy: 'Kimden',
  exchange: 'Takaslı',
} as const;

export const COMMERCIAL_LABELS = {
  price: 'Fiyat',
  propertyType: 'Emlak Tipi',
  commercialType: 'Türü',
  area: 'm²',
  roomCount: 'Bölüm & Oda Sayısı',
  heating: 'Isıtma',
  buildingAge: 'Bina Yaşı',
  deedStatus: 'Tapu Durumu',
  listedBy: 'Kimden',
  exchange: 'Takaslı',
} as const;

export const LAND_LABELS = {
  propertyType: 'Emlak Tipi',
  zoningStatus: 'İmar Durumu',
  area: 'm²',
  pricePerSqm: 'm² Fiyatı',
  islandNumber: 'Ada No',
  parcelNumber: 'Parsel No',
  sheetNumber: 'Pafta No',
  floorAreaRatio: 'Kaks (Emsal)',
  heightLimit: 'Gabari',
  mortgageEligible: 'Krediye Uygunluk',
  deedStatus: 'Tapu Durumu',
  listedBy: 'Kimden',
  exchange: 'Takaslı',
} as const;

export const PROPERTY_TYPE_OPTIONS = {
  FOR_SALE: 'Satılık',
  FOR_RENT: 'Kiralık',
  TRANSFER_SALE: 'Devren Satılık',
  TRANSFER_RENT: 'Devren Kiralık',
  FOR_FLOOR_EQUIVALENT: 'Kat Karşılığı Satılık',
} as const;

export const ROOM_COUNT_OPTIONS = {
  STUDIO: 'Stüdyo (1+0)',
  '1+1': '1+1',
  '1.5+1': '1.5+1',
  '2+0': '2+0',
  '2+1': '2+1',
  '2.5+1': '2.5+1',
  '2+2': '2+2',
  '3+0': '3+0',
  '3+1': '3+1',
  '3.5+1': '3.5+1',
  '3+2': '3+2',
  '3+3': '3+3',
  '4+0': '4+0',
  '4+1': '4+1',
  '4.5+1': '4.5+1',
  '4.5+2': '4.5+2',
  '4+2': '4+2',
  '4+3': '4+3',
  '4+4': '4+4',
  '5+1': '5+1',
  '5.5+1': '5.5+1',
  '5+2': '5+2',
  '5+3': '5+3',
} as const;

export const HOUSING_TYPE_OPTIONS = {
  DUPLEX: 'Dubleks',
  TOP_FLOOR: 'En Üst Kat',
  MIDDLE_FLOOR: 'Ara Kat',
  MIDDLE_FLOOR_DUPLEX: 'Ara Kat Dubleks',
  GARDEN_DUPLEX: 'Bahçe Dubleksi',
  ROOF_DUPLEX: 'Çatı Dubleksi',
  FOURPLEX: 'Forleks',
  REVERSE_DUPLEX: 'Ters Dubleks',
  TRIPLEX: 'Tripleks',
} as const;

export const BUILDING_AGE_OPTIONS = {
  '0_READY': '0 (Oturuma Hazır)',
  '0_CONSTRUCTION': '0 (Yapım Aşamasında)',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6_10': '6-10 arası',
  '11_15': '11-15 arası',
  '16_20': '16-20 arası',
  '21_25': '21-25 arası',
  '26_30': '26-30 arası',
  '31_PLUS': '31 ve üzeri',
} as const;

export const CURRENT_FLOOR_OPTIONS = {
  BASEMENT_4: 'Giriş Altı Kot 4',
  BASEMENT_3: 'Giriş Altı Kot 3',
  BASEMENT_2: 'Giriş Altı Kot 2',
  BASEMENT_1: 'Giriş Altı Kot 1',
  BASEMENT: 'Bodrum Kat',
  GROUND: 'Zemin Kat',
  GARDEN: 'Bahçe Katı',
  ENTRANCE: 'Giriş Katı',
  HIGH_ENTRANCE: 'Yüksek Giriş',
  DETACHED: 'Müstakil',
  VILLA: 'Villa Tipi',
  ROOF: 'Çatı Katı',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  '11': '11',
  '12': '12',
  '13': '13',
  '14': '14',
  '15': '15',
  '16': '16',
  '17': '17',
  '18': '18',
  '19': '19',
  '20': '20',
  '21': '21',
  '22': '22',
  '23': '23',
  '24': '24',
  '25': '25',
  '26': '26',
  '27': '27',
  '28': '28',
  '29': '29',
  '30_PLUS': '30 ve üzeri',
} as const;

export const TOTAL_FLOORS_OPTIONS = {
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  '11': '11',
  '12': '12',
  '13': '13',
  '14': '14',
  '15': '15',
  '16': '16',
  '17': '17',
  '18': '18',
  '19': '19',
  '20': '20',
  '21': '21',
  '22': '22',
  '23': '23',
  '24': '24',
  '25': '25',
  '26': '26',
  '27': '27',
  '28': '28',
  '29': '29',
  '30_PLUS': '30 ve üzeri',
} as const;

export const HEATING_OPTIONS = {
  NONE: 'Yok',
  STOVE: 'Soba',
  NATURAL_GAS_STOVE: 'Doğalgaz Sobası',
  FLOOR_HEATING_SYSTEM: 'Kat Kaloriferi',
  CENTRAL: 'Merkezi',
  CENTRAL_METER: 'Merkezi (Pay Ölçer)',
  COMBI_NATURAL_GAS: 'Kombi (Doğalgaz)',
  COMBI_ELECTRIC: 'Kombi (Elektrik)',
  UNDERFLOOR_HEATING: 'Yerden Isıtma',
  AIR_CONDITIONING: 'Klima',
  FANCOIL: 'Fancoil Ünitesi',
  SOLAR_ENERGY: 'Güneş Enerjisi',
  ELECTRIC_RADIATOR: 'Elektrikli Radyatör',
  GEOTHERMAL: 'Jeotermal',
  FIREPLACE: 'Şömine',
  VRV: 'VRV',
  HEAT_PUMP: 'Isı Pompası',
} as const;

export const BATHROOM_COUNT_OPTIONS = {
  NONE: 'Yok',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '6_PLUS': '6 Üzeri',
} as const;

export const KITCHEN_OPTIONS = {
  OPEN_AMERICAN: 'Açık (Amerikan)',
  CLOSED: 'Kapalı',
} as const;

export const BALCONY_OPTIONS = {
  YES: 'Var',
  NO: 'Yok',
} as const;

export const ELEVATOR_OPTIONS = {
  YES: 'Var',
  NO: 'Yok',
} as const;

export const PARKING_OPTIONS = {
  OPEN: 'Açık Otopark',
  CLOSED: 'Kapalı Otopark',
  OPEN_AND_CLOSED: 'Açık & Kapalı Otopark',
  NONE: 'Yok',
} as const;

export const FURNISHED_OPTIONS = {
  YES: 'Evet',
  NO: 'Hayır',
} as const;

export const USAGE_STATUS_OPTIONS = {
  EMPTY: 'Boş',
  TENANT: 'Kiracılı',
  OWNER: 'Mülk Sahibi',
} as const;

export const IN_COMPLEX_OPTIONS = {
  YES: 'Evet',
  NO: 'Hayır',
} as const;

export const MORTGAGE_ELIGIBLE_OPTIONS = {
  YES: 'Evet',
  NO: 'Hayır',
} as const;

export const DEED_STATUS_OPTIONS = {
  CONDOMINIUM: 'Kat Mülkiyetli',
  EASEMENT: 'Kat İrtifaklı',
  SHARED_DEED: 'Hisseli Tapu',
  DETACHED_DEED: 'Müstakil Tapulu',
  LAND_DEED: 'Arsa Tapulu',
  COOPERATIVE_DEED: 'Kooperatif Hisseli Tapu',
  USUFRUCT: 'İntifa Hakkı Tesisli',
  FOREIGN_DEED: 'Yurt Dışı Tapulu',
  NO_DEED: 'Tapu Kaydı Yok',
} as const;

export const LISTED_BY_OPTIONS = {
  OWNER: 'Sahibinden',
  AGENCY: 'Emlak Ofisinden',
  CONSTRUCTION_COMPANY: 'İnşaat Firmasından',
  BANK: 'Bankadan',
} as const;

export const EXCHANGE_OPTIONS = {
  YES: 'Evet',
  NO: 'Hayır',
} as const;

export const COMMERCIAL_TYPE_OPTIONS = {
  SHOP: 'Dükkan & Mağaza',
  GAS_STATION: 'Akaryakıt İstasyonu',
  WORKSHOP: 'Atölye',
  MALL: 'AVM',
  KIOSK: 'Büfe',
  OFFICE: 'Büro & Ofis',
  FARM: 'Çiftlik',
  WAREHOUSE: 'Depo & Antrepo',
  WEDDING_HALL: 'Düğün Salonu',
  POWER_PLANT: 'Enerji Santrali',
  FACTORY: 'Fabrika & Üretim Tesisi',
  GARAGE: 'Garaj & Park Yeri',
  MANUFACTURING: 'İmalathane',
  BUSINESS_CENTER_FLOOR: 'İş Hanı Katı & Ofisi',
  CAFE_BAR: 'Kafe & Bar',
  CANTEEN: 'Kantin',
  BREAKFAST_GARDEN: 'Kır & Kahvaltı Bahçesi',
  TEA_HOUSE: 'Kıraathane',
  FULL_BUILDING: 'Komple Bina',
  PARKING: 'Otopark & Garaj',
  CAR_WASH_SALON: 'Oto Yıkama & Kuaför',
  BAKERY: 'Pastane, Fırın & Tatlıcı',
  MARKET_PLACE: 'Pazar Yeri',
  PLAZA: 'Plaza',
  PLAZA_FLOOR: 'Plaza Katı & Ofisi',
  RESTAURANT: 'Restoran & Lokanta',
  RESIDENCE_FLOOR: 'Rezidans Katı & Ofisi',
  HEALTH_CENTER: 'Sağlık Merkezi',
  CINEMA_HALL: 'Sinema & Konferans Salonu',
  SPA: 'SPA, Hamam & Sauna',
  SPORTS_FACILITY: 'Spor Tesisi',
  VILLA: 'Villa',
  DORMITORY: 'Yurt',
} as const;

export const ZONING_STATUS_OPTIONS = {
  ISLAND: 'Ada',
  A_LEGEND: 'A-Lejantlı',
  LAND: 'Arazi',
  VINEYARD_GARDEN: 'Bağ & Bahçe',
  WAREHOUSE: 'Depo & Antrepo',
  EDUCATION: 'Eğitim',
  RESIDENTIAL: 'Konut',
  CULTURAL_FACILITY: 'Kültürel Tesis',
  MISCELLANEOUS: 'Muhtelif',
  SPECIAL_USE: 'Özel Kullanım',
  HEALTH: 'Sağlık',
  INDUSTRIAL: 'Sanayi',
  CONSERVATION_AREA: 'Sit Alanı',
  FIELD: 'Tarla',
  FIELD_VINEYARD: 'Tarla + Bağ',
  COMMERCIAL: 'Ticari',
  COMMERCIAL_RESIDENTIAL: 'Ticari + Konut',
  MASS_HOUSING: 'Toplu Konut',
  TOURISM: 'Turizm',
  TOURISM_RESIDENTIAL: 'Turizm + Konut',
  TOURISM_COMMERCIAL: 'Turizm + Ticari',
  VILLA: 'Villa',
  OLIVE_GROVE: 'Zeytinlik',
} as const;

export const PROJECT_TYPE_OPTIONS = {
  RESIDENTIAL: 'Konut',
  COMMERCIAL: 'Ticari',
} as const;

export const PROPERTY_TYPE_MAIN_OPTIONS = {
  RESIDENTIAL: 'Konut',
  COMMERCIAL: 'Ticari',
  LAND: 'Arsa',
} as const;

export function translateOption<T extends Record<string, string>>(
  value: string | null | undefined,
  optionsMap: T
): string {
  if (!value) return '-';
  return optionsMap[value as keyof T] || value;
}

export function getFieldLabels(type: 'residential' | 'commercial' | 'land') {
  switch (type) {
    case 'residential':
      return RESIDENTIAL_LABELS;
    case 'commercial':
      return COMMERCIAL_LABELS;
    case 'land':
      return LAND_LABELS;
    default:
      return {};
  }
}

export const ALL_OPTIONS = {
  propertyType: PROPERTY_TYPE_OPTIONS,
  roomCount: ROOM_COUNT_OPTIONS,
  housingType: HOUSING_TYPE_OPTIONS,
  buildingAge: BUILDING_AGE_OPTIONS,
  currentFloor: CURRENT_FLOOR_OPTIONS,
  totalFloors: TOTAL_FLOORS_OPTIONS,
  heating: HEATING_OPTIONS,
  bathroomCount: BATHROOM_COUNT_OPTIONS,
  kitchen: KITCHEN_OPTIONS,
  balcony: BALCONY_OPTIONS,
  elevator: ELEVATOR_OPTIONS,
  parking: PARKING_OPTIONS,
  furnished: FURNISHED_OPTIONS,
  usageStatus: USAGE_STATUS_OPTIONS,
  inComplex: IN_COMPLEX_OPTIONS,
  mortgageEligible: MORTGAGE_ELIGIBLE_OPTIONS,
  deedStatus: DEED_STATUS_OPTIONS,
  listedBy: LISTED_BY_OPTIONS,
  exchange: EXCHANGE_OPTIONS,
  commercialType: COMMERCIAL_TYPE_OPTIONS,
  zoningStatus: ZONING_STATUS_OPTIONS,
} as const;
