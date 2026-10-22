import { GalleryFilters } from './gallery-filters';
import { GalleryGrid } from './gallery-grid';
import type { GalleryItem, GalleryTerm } from '@/types/gallery';

interface GallerySectionProps {
  items: GalleryItem[];
  terms: GalleryTerm[];
  activeSlug: string | null;
}

export function GallerySection({
  items,
  terms,
  activeSlug,
}: GallerySectionProps) {
  return (
    <section
      aria-labelledby="gallery-heading"
      className="w-full bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <header className="text-center">
          <h2
            id="gallery-heading"
            className="text-[26px] font-bold uppercase tracking-wide text-[#006513] sm:text-[30px] lg:text-[36px]"
          >
            Hình ảnh &amp; Video
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[14px] leading-6 text-[#006513] sm:text-[16px] sm:leading-7 lg:text-[20px]">
            Nơi chia sẻ các hoạt động, sự kiện và câu chuyện thực tế trong quá
            trình đồng hành cùng doanh nghiệp và nông sản Việt.
          </p>
        </header>

        <div className="mt-9 flex justify-center sm:mt-10">
          <GalleryFilters terms={terms} activeSlug={activeSlug} />
        </div>

        <div className="mx-auto mt-10 w-full sm:mt-12 lg:mt-14 lg:w-[63%] lg:max-w-[900px]">
          <GalleryGrid key={activeSlug ?? 'all'} items={items} />
        </div>
      </div>
    </section>
  );
}
