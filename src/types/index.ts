export interface ProjectImage {
  id: string;
  url: string;
  publicId?: string;
  alt?: string;
  order: number;
  isCover: boolean;
}

export interface PropertyImage {
  id: string;
  url: string;
  publicId?: string;
  alt?: string;
  order: number;
  isCover: boolean;
}

// Residential Project Details
export interface ResidentialProjectDetails {
  id: string;
  projectId: string;
  price?: number | null;
  propertyType?: string | null;
  grossArea?: number | null;
  netArea?: number | null;
  roomCount?: string | null;
  housingType?: string | null;
  buildingAge?: string | null;
  currentFloor?: string | null;
  totalFloors?: string | null;
  heating?: string | null;
  bathroomCount?: string | null;
  kitchen?: string | null;
  balcony?: string | null;
  elevator?: string | null;
  parking?: string | null;
  furnished?: string | null;
  usageStatus?: string | null;
  inComplex?: string | null;
  mortgageEligible?: string | null;
  deedStatus?: string | null;
  listedBy?: string | null;
  exchange?: string | null;
}

// Commercial Project Details
export interface CommercialProjectDetails {
  id: string;
  projectId: string;
  price?: number | null;
  propertyType?: string | null;
  commercialType?: string | null;
  area?: number | null;
  roomCount?: string | null;
  heating?: string | null;
  buildingAge?: string | null;
  deedStatus?: string | null;
  listedBy?: string | null;
  exchange?: string | null;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  location: string;
  description: string;
  year: string;
  images: ProjectImage[];
  type: 'RESIDENTIAL' | 'COMMERCIAL';
  featured?: boolean;
  featuredOrder?: number;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  latitude?: number | null;
  longitude?: number | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  // Related details
  residentialDetails?: ResidentialProjectDetails | null;
  commercialDetails?: CommercialProjectDetails | null;
}

// Residential Property Details
export interface ResidentialPropertyDetails {
  id: string;
  propertyId: string;
  price?: number | null;
  propertyType?: string | null;
  grossArea?: number | null;
  netArea?: number | null;
  roomCount?: string | null;
  housingType?: string | null;
  buildingAge?: string | null;
  currentFloor?: string | null;
  totalFloors?: string | null;
  heating?: string | null;
  bathroomCount?: string | null;
  kitchen?: string | null;
  balcony?: string | null;
  elevator?: string | null;
  parking?: string | null;
  furnished?: string | null;
  usageStatus?: string | null;
  inComplex?: string | null;
  mortgageEligible?: string | null;
  deedStatus?: string | null;
  listedBy?: string | null;
  exchange?: string | null;
}

// Commercial Property Details
export interface CommercialPropertyDetails {
  id: string;
  propertyId: string;
  price?: number | null;
  propertyType?: string | null;
  commercialType?: string | null;
  area?: number | null;
  roomCount?: string | null;
  heating?: string | null;
  buildingAge?: string | null;
  deedStatus?: string | null;
  listedBy?: string | null;
  exchange?: string | null;
}

// Land Property Details
export interface LandPropertyDetails {
  id: string;
  propertyId: string;
  propertyType?: string | null;
  zoningStatus?: string | null;
  area?: number | null;
  pricePerSqm?: number | null;
  islandNumber?: number | null;
  parcelNumber?: number | null;
  sheetNumber?: number | null;
  floorAreaRatio?: number | null;
  heightLimit?: number | null;
  mortgageEligible?: string | null;
  deedStatus?: string | null;
  listedBy?: string | null;
  exchange?: string | null;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  location: string;
  description: string;
  type: 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND';
  images: PropertyImage[];
  featured?: boolean;
  featuredOrder?: number;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  latitude?: number | null;
  longitude?: number | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  // Related details
  residentialDetails?: ResidentialPropertyDetails | null;
  commercialDetails?: CommercialPropertyDetails | null;
  landDetails?: LandPropertyDetails | null;
}
