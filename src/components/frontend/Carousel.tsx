"use client";

import { useState, useEffect, useMemo } from 'react';

type ImageItem = string | { url: string; alt?: string };

interface CarouselProps {
  images: ImageItem[];
  className?: string;
  height?: string;
  showThumbnails?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export default function Carousel({
  images,
  className = '',
  height = 'h-96',
  showThumbnails = true,
  autoPlay = true,
  autoPlayInterval = 5000
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const normalizedImages = useMemo(() => {
    return images.map(img => {
      if (typeof img === 'string') return { url: img, alt: '' };
      return { url: img.url, alt: img.alt || '' };
    });
  }, [images]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className={`relative w-full ${height} bg-border rounded-xl flex items-center justify-center ${className}`}>
        <p className="text-text-tertiary">Görsel bulunamadı</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className={`relative overflow-hidden rounded-xl shadow-lg ${height}`}>
        {normalizedImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.url}
              alt={image.alt || `Slide ${index + 1}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}

        {images.length > 1 && (
          <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-4 left-1/2">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
                aria-current={index === currentSlide}
                aria-label={`Slide ${index + 1}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="absolute z-30 flex items-center justify-center w-10 h-10 transition-all -translate-y-1/2 rounded-full shadow-lg cursor-pointer top-1/2 left-4 bg-primary-bg border-2 border-hero hover:bg-primary-bg-hover focus:outline-none"
              onClick={prevSlide}
            >
              <svg
                className="w-5 h-5 text-hero"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="m15 19-7-7 7-7"
                />
              </svg>
              <span className="sr-only">Önceki</span>
            </button>
            <button
              type="button"
              className="absolute z-30 flex items-center justify-center w-10 h-10 transition-all -translate-y-1/2 rounded-full shadow-lg cursor-pointer top-1/2 right-4 bg-primary-bg border-2 border-hero hover:bg-primary-bg-hover focus:outline-none"
              onClick={nextSlide}
            >
              <svg
                className="w-5 h-5 text-hero"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="m9 5 7 7-7 7"
                />
              </svg>
              <span className="sr-only">Sonraki</span>
            </button>
          </>
        )}
      </div>

      {showThumbnails && normalizedImages.length > 1 && (
        <div className="mt-4 max-h-[180px] overflow-y-auto scrollbar-hero pr-1">
          <div className="grid grid-cols-4 gap-2">
            {normalizedImages.map((image, index) => (
              <button
                key={index}
                className={`relative h-20 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentSlide
                    ? 'border-hero shadow-md'
                    : 'border-transparent hover:border-border-dark'
                }`}
                onClick={() => goToSlide(index)}
              >
                <img
                  src={image.url}
                  alt={image.alt || `Thumbnail ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                {index === currentSlide && (
                  <div className="absolute inset-0 bg-hero/20" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}