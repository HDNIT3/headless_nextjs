import Image from 'next/image';

/**
 * Hero shared by the gallery page. The image lives locally so the banner keeps
 * working even when WordPress is temporarily unavailable.
 */
export function GalleryHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#124d27]">
      <div className="relative h-[320px] w-full sm:h-[360px] lg:h-[400px]">
        <Image
          src="/images/gallery/hero.png"
          alt="Đội ngũ Bao Bì Đức Trọng đóng gói nông sản"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#0b4d22]/90 via-[#0b4d22]/55 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-[1360px] flex-col justify-center px-5 sm:px-8 lg:px-[106px]">
          <div className="max-w-2xl text-white">
            <h1 className="text-xl font-extrabold uppercase leading-[1.25] tracking-wide text-white drop-shadow-xs sm:text-2xl md:text-3xl lg:text-[36px]">
              <span className="block">Năng lực được</span>
              <span className="mt-1 block">Thể hiện qua</span>
              <span className="mt-1 block">Các hoạt động</span>
              <span className="mt-1 block">Thực tế</span>
            </h1>

            <p className="mt-3 max-w-xl text-xs font-normal leading-relaxed text-white/90 sm:mt-4 sm:text-sm md:text-[15px]">
              Cập nhật kiến thức đóng gói, giải pháp bảo quản nông sản và những
              hoạt động mới nhất từ Bao Bì Đức Trọng.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
