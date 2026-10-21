'use client';

import { useEffect, useState } from 'react';
import { ImageWithFallback } from '@/components/common/image-with-fallback';
import type { ProductGalleryImage, ProductNode } from '@/types/product';

interface ProductGalleryProps {
  product: ProductNode & {
    galleryImages?: {
      nodes: ProductGalleryImage[];
    } | null;
  };
}

export function ProductGallery({ product }: ProductGalleryProps) {
  // Ảnh chính (image) và ảnh gallery là hai nguồn riêng biệt.
  const galleryImages = product.galleryImages?.nodes ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isOpen = openIndex !== null;
  const modalImage = isOpen ? galleryImages[openIndex] : null;

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenIndex(null);
      }

      if (event.key === 'ArrowLeft') {
        setOpenIndex((current) =>
          current === null
            ? current
            : (current - 1 + galleryImages.length) % galleryImages.length
        );
      }

      if (event.key === 'ArrowRight') {
        setOpenIndex((current) =>
          current === null ? current : (current + 1) % galleryImages.length
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, galleryImages.length]);

  const showPrevious = () => {
    setOpenIndex((current) =>
      current === null
        ? current
        : (current - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const showNext = () => {
    setOpenIndex((current) =>
      current === null ? current : (current + 1) % galleryImages.length
    );
  };

  return (
    <>
      <div
        className={`grid grid-cols-1 gap-3 sm:gap-4 ${
          galleryImages.length > 0
            ? 'sm:grid-cols-[minmax(0,1fr)_92px] lg:grid-cols-[minmax(0,1fr)_104px]'
            : ''
        }`}
      >
        {/* Khung ảnh chính */}
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {product.image?.sourceUrl ? (
            <div
              key={product.image.sourceUrl}
              className="gallery-image-in absolute inset-0"
            >
              <ImageWithFallback
                src={product.image.sourceUrl}
                alt={product.image.altText || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : (
            <ImageWithFallback
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          )}
        </div>

        {/* Khung riêng cho từng ảnh gallery */}
        {galleryImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2.5 sm:flex sm:h-full sm:flex-col sm:gap-3">
            {galleryImages.map((image, index) => (
              <button
                key={image.id || image.sourceUrl}
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Mở ảnh ${index + 1} của ${product.name}`}
                style={{ animationDelay: `${index * 70}ms` }}
                className="gallery-thumb-in group relative aspect-[4/3] w-full min-h-0 cursor-pointer overflow-hidden rounded-md border-2 border-gray-200 bg-gray-50 transition-all duration-300 hover:border-[#0c5c36]/60 sm:aspect-auto sm:flex-1"
              >
                <ImageWithFallback
                  src={image.sourceUrl}
                  alt={image.altText || `${product.name} - ảnh ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 30vw, 104px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Gợi ý mở ảnh lớn */}
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/25 group-hover:opacity-100">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white drop-shadow"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    <line x1="11" y1="8" x2="11" y2="14" />
                    <line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal xem ảnh gallery */}
      {isOpen && modalImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Thư viện ảnh ${product.name}`}
          onClick={() => setOpenIndex(null)}
          className="lightbox-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Đóng"
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:right-6 sm:top-6"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div
            onClick={(event) => event.stopPropagation()}
            className="lightbox-zoom-in flex w-full max-w-5xl flex-col items-center"
          >
            <div className="relative h-[55vh] w-full overflow-hidden rounded-xl bg-black/40 sm:h-[68vh]">
              <ImageWithFallback
                key={modalImage.sourceUrl}
                src={modalImage.sourceUrl}
                alt={modalImage.altText || `${product.name} - ảnh ${openIndex + 1}`}
                fill
                sizes="90vw"
                className="gallery-image-in object-contain"
              />

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrevious}
                    aria-label="Ảnh trước"
                    className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition-colors hover:bg-[#0c5c36] sm:left-4"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Ảnh sau"
                    className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition-colors hover:bg-[#0c5c36] sm:right-4"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2.5">
              {galleryImages.map((image, index) => (
                <button
                  key={image.id || image.sourceUrl}
                  type="button"
                  onClick={() => setOpenIndex(index)}
                  aria-label={`Xem ảnh ${index + 1}`}
                  aria-current={index === openIndex}
                  className={`relative h-14 w-20 overflow-hidden rounded-md border-2 transition-all ${
                    index === openIndex
                      ? 'border-[#f15a24] opacity-100'
                      : 'border-white/25 opacity-60 hover:opacity-100'
                  }`}
                >
                  <ImageWithFallback
                    src={image.sourceUrl}
                    alt={image.altText || `${product.name} - ảnh ${index + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            <p className="mt-3 text-[12px] text-white/70">
              {openIndex + 1} / {galleryImages.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
