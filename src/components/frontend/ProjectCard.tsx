'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
}

// Label çevirileri
const typeLabels: Record<string, string> = {
  RESIDENTIAL: "Konut",
  COMMERCIAL: "Ticari",
};

const propertyTypeLabels: Record<string, string> = {
  FOR_SALE: "Satılık",
  FOR_RENT: "Kiralık",
  TRANSFER_SALE: "Devren Satılık",
  TRANSFER_RENT: "Devren Kiralık",
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const fallbackImage = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500';

  // Image URL'ini al - hem string hem de object formatını destekle
  const getImageUrl = () => {
    if (!project.images || project.images.length === 0) return fallbackImage;
    const firstImage = project.images[0];
    if (typeof firstImage === 'string') return firstImage;
    return firstImage?.url || fallbackImage;
  };

  const imageUrl = getImageUrl();

  // Detay bilgilerini al
  const details = project.residentialDetails || project.commercialDetails;

  // Fiyat formatlama
  const formatPrice = (price: number | null | undefined) => {
    if (!price) return null;
    return new Intl.NumberFormat('tr-TR').format(price) + ' TL';
  };

  // Alan formatlama
  const formatArea = (area: number | null | undefined) => {
    if (!area) return null;
    return new Intl.NumberFormat('tr-TR').format(area) + ' m²';
  };

  // Kategori etiketi
  const getCategoryLabel = () => {
    return typeLabels[project.type] || project.type;
  };

  // Emlak tipi etiketi
  const getPropertyTypeLabel = () => {
    if (!details?.propertyType) return null;
    return propertyTypeLabels[details.propertyType] || details.propertyType;
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  // Fiyat
  const price = formatPrice(details?.price);

  // Alan (residential için grossArea, commercial için area)
  const area = project.residentialDetails
    ? formatArea(project.residentialDetails.grossArea)
    : project.commercialDetails
      ? formatArea(project.commercialDetails.area)
      : null;

  // Oda sayısı
  const roomCount = details?.roomCount;

  // Emlak tipi
  const propertyType = getPropertyTypeLabel();

  return (
    <div
      className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] aspect-[4/5] mb-4 sm:mb-6 [-webkit-backface-visibility:hidden] mx-auto cursor-pointer xl:cursor-default isolate"
      onClick={handleCardClick}
    >
      <div className={`[transform-style:preserve-3d] [-webkit-transform-style:preserve-3d] [-ms-transform-style:preserve-3d] [perspective:1000px] [-webkit-perspective:1000px] w-full h-full relative group ${isFlipped ? '[&>*:first-child]:[transform:rotateY(-180deg)] [&>*:first-child]:[-webkit-transform:rotateY(-180deg)] [&>*:last-child]:[transform:rotateY(0deg)] [&>*:last-child]:[-webkit-transform:rotateY(0deg)]' : ''}`}>
        {/* Front Face */}
        <div
          className="bg-cover bg-center bg-no-repeat rounded-xl [transition:transform_0.7s_cubic-bezier(0.4,0.2,0.2,1)] [-webkit-transition:transform_0.7s_cubic-bezier(0.4,0.2,0.2,1)] [-ms-transition:transform_0.7s_cubic-bezier(0.4,0.2,0.2,1)] [-webkit-backface-visibility:hidden] [backface-visibility:hidden] absolute top-0 left-0 w-full h-full shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] [transform:rotateY(0deg)] [-webkit-transform:rotateY(0deg)] [-ms-transform:rotateY(0deg)] [transform-style:preserve-3d] [-webkit-transform-style:preserve-3d] [-ms-transform-style:preserve-3d] flex items-center justify-center group-hover:[transform:rotateY(-180deg)] group-hover:[-webkit-transform:rotateY(-180deg)] group-hover:[-ms-transform:rotateY(-180deg)]"
          style={{
            backgroundImage: `url(${imageError ? fallbackImage : imageUrl})`
          }}
        >
          <div className="absolute left-0 w-full px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-5 outline outline-1 outline-transparent [-webkit-perspective:inherit] [perspective:inherit] z-[2] [transform:translateY(-50%)_translateZ(60px)_scale(0.94)] [-webkit-transform:translateY(-50%)_translateZ(60px)_scale(0.94)] [-ms-transform:translateY(-50%)_translateZ(60px)_scale(0.94)] top-1/2 text-center text-text-white [transition:none!important] [will-change:transform]">
            <div className="w-full [transition:none!important] [will-change:transform]">
              <h3 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold mb-1.5 sm:mb-2 md:mb-3 text-white line-clamp-2 [text-shadow:0_0_8px_rgba(0,0,0,1),2px_2px_4px_rgba(0,0,0,0.9),-1px_-1px_0_rgba(0,0,0,0.5),1px_-1px_0_rgba(0,0,0,0.5),-1px_1px_0_rgba(0,0,0,0.5),1px_1px_0_rgba(0,0,0,0.5)]">
                {project.title}
              </h3>
              <p className="text-lg sm:text-xl md:text-xl mb-1 sm:mb-1.5 md:mb-2 text-white line-clamp-1 [text-shadow:0_0_6px_rgba(0,0,0,0.9),1px_1px_3px_rgba(0,0,0,0.8),-1px_-1px_0_rgba(0,0,0,0.4),1px_-1px_0_rgba(0,0,0,0.4),-1px_1px_0_rgba(0,0,0,0.4),1px_1px_0_rgba(0,0,0,0.4)]">
                {project.location}
              </p>
              <p className="text-base sm:text-lg md:text-lg mb-2 sm:mb-3 md:mb-4 text-white/90 [text-shadow:0_0_4px_rgba(0,0,0,0.8),1px_1px_2px_rgba(0,0,0,0.7)]">
                {project.year}
              </p>
              <div className="bg-gradient-to-br from-primary to-primary-dark text-text-white py-1 sm:py-1.5 md:py-2 px-3 sm:px-4 md:px-5 rounded-full text-sm sm:text-base font-semibold inline-block shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                {getCategoryLabel()}
              </div>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div
          className="bg-cover bg-center bg-no-repeat rounded-xl [transition:transform_0.7s_cubic-bezier(0.4,0.2,0.2,1)] [-webkit-transition:transform_0.7s_cubic-bezier(0.4,0.2,0.2,1)] [-ms-transition:transform_0.7s_cubic-bezier(0.4,0.2,0.2,1)] [-webkit-backface-visibility:hidden] [backface-visibility:hidden] absolute top-0 left-0 w-full h-full shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] [transform:rotateY(180deg)] [-webkit-transform:rotateY(180deg)] [-ms-transform:rotateY(180deg)] [transform-style:preserve-3d] [-webkit-transform-style:preserve-3d] [-ms-transform-style:preserve-3d] flex items-center justify-center bg-primary-dark group-hover:[transform:rotateY(0deg)] group-hover:[-webkit-transform:rotateY(0deg)] group-hover:[-ms-transform:rotateY(0deg)]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${imageError ? fallbackImage : imageUrl})`
          }}
        >
          <div className="absolute left-0 w-full px-4 py-3 sm:px-6 sm:py-4 outline outline-1 outline-transparent [-webkit-perspective:inherit] [perspective:inherit] z-[2] [transform:translateY(-50%)_translateZ(60px)_scale(0.94)] [-webkit-transform:translateY(-50%)_translateZ(60px)_scale(0.94)] [-ms-transform:translateY(-50%)_translateZ(60px)_scale(0.94)] top-1/2 text-center text-text-white [transition:none!important] [will-change:transform]">
            <div className="w-full [transition:none!important] [will-change:transform]">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1.5 sm:mb-2 [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)] text-text-white line-clamp-2">
                {project.title}
              </h3>
              <p className="text-sm sm:text-base mb-1.5 sm:mb-2 opacity-90 [text-shadow:1px_1px_2px_rgba(0,0,0,0.5)] text-text-white-secondary line-clamp-1">
                {project.location}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 opacity-90 line-clamp-2 text-text-white-secondary">
                {project.description}
              </p>

              <div className="grid grid-cols-2 gap-1 sm:gap-1.5 my-2 sm:my-3">
              <div className="flex justify-between items-center py-0.5 sm:py-1 px-1.5 sm:px-2 border-b border-white/30">
                <span className="text-[10px] sm:text-xs opacity-80">Kategori:</span>
                <strong className="text-[10px] sm:text-xs text-right truncate ml-1">{getCategoryLabel()}</strong>
              </div>
              {propertyType && (
                <div className="flex justify-between items-center py-0.5 sm:py-1 px-1.5 sm:px-2 border-b border-white/30">
                  <span className="text-[10px] sm:text-xs opacity-80">Durum:</span>
                  <strong className="text-[10px] sm:text-xs text-right truncate ml-1">
                    {propertyType}
                  </strong>
                </div>
              )}
              {price && (
                <div className="flex justify-between items-center py-0.5 sm:py-1 px-1.5 sm:px-2 border-b border-white/30">
                  <span className="text-[10px] sm:text-xs opacity-80">Fiyat:</span>
                  <strong className="text-[10px] sm:text-xs text-right text-white truncate ml-1">{price}</strong>
                </div>
              )}
              {area && (
                <div className="flex justify-between items-center py-0.5 sm:py-1 px-1.5 sm:px-2 border-b border-white/30">
                  <span className="text-[10px] sm:text-xs opacity-80">Alan:</span>
                  <strong className="text-[10px] sm:text-xs text-right truncate ml-1">{area}</strong>
                </div>
              )}
              {roomCount && (
                <div className="flex justify-between items-center py-0.5 sm:py-1 px-1.5 sm:px-2 border-b border-white/30">
                  <span className="text-[10px] sm:text-xs opacity-80">Oda:</span>
                  <strong className="text-[10px] sm:text-xs text-right truncate ml-1">{roomCount}</strong>
                </div>
              )}
              <div className="flex justify-between items-center py-0.5 sm:py-1 px-1.5 sm:px-2 border-b border-white/30">
                <span className="text-[10px] sm:text-xs opacity-80">Yıl:</span>
                <strong className="text-[10px] sm:text-xs text-right truncate ml-1">{project.year}</strong>
              </div>
            </div>

              <Link
                href={`/projects/${project.slug || project.id}`}
                className="bg-transparent border-2 border-white rounded-md text-white cursor-pointer text-xs sm:text-sm font-bold mt-2 sm:mt-3 py-1.5 sm:py-2 px-3 sm:px-4 uppercase no-underline inline-block transition-all duration-300 ease-in-out hover:bg-white hover:text-primary-dark hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
                onClick={(e) => e.stopPropagation()}
              >
                Projeyi İncele
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
