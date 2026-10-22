import { ImageWithFallback } from '@/components/common/image-with-fallback';
import type { GalleryItem } from '@/types/gallery';

interface GalleryCardProps {
  item: GalleryItem;
  featured?: boolean;
}

export function GalleryCard({ item, featured = false }: GalleryCardProps) {
  const image = item.featuredImage?.node;

  return (
    <article
      className={`group relative overflow-hidden rounded-[11px] bg-gray-100 ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      <div className="relative h-[260px] w-full sm:h-[300px] lg:h-[354px]">
        <ImageWithFallback
          src={image?.sourceUrl}
          alt={image?.altText || item.title}
          fill
          sizes={
            featured
              ? '(max-width: 1023px) 100vw, 70vw'
              : '(max-width: 1023px) 100vw, 50vw'
          }
          fallbackSrc="/images/post/new_banner.png"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[147px] bg-gradient-to-t from-[#004C0E] via-[#004C0E]/55 to-transparent" />

        <h3 className="absolute inset-x-0 bottom-0 line-clamp-2 px-5 pb-5 text-center text-[17px] font-semibold uppercase leading-tight text-white drop-shadow-xs sm:text-[19px] lg:text-[21px]">
          {item.title}
        </h3>
      </div>
    </article>
  );
}
