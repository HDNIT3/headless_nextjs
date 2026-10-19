import Image from 'next/image';

interface HeroBannerProps {
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
}

export function HeroBanner({
  titleLine1 = 'CHIA SẺ CÁC THÔNG TIN VỀ',
  titleLine2 = 'QUY TRÌNH & KIẾN THỨC BAO BÌ',
  subtitle = 'Cập nhật kiến thức đóng gói, giải pháp bảo quản nông sản và những hoạt động mới nhất từ Bao Bì Đức Trọng.',
}: HeroBannerProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#124d27]">
      {/* Background Banner Image */}
      <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px]">
        <Image
          src="/images/new_banner.png"
          alt="Bao Bì Đức Trọng Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />

        {/* Gradient Overlay for Mobile & Left Content Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d4520]/95 via-[#0d4520]/80 sm:via-[#0d4520]/60 to-transparent" />

        {/* Content Container */}
        <div className="relative h-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col justify-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-extrabold uppercase leading-[1.25] tracking-wide text-white drop-shadow-xs">
              <span className="block">{titleLine1}</span>
              <span className="block mt-1">{titleLine2}</span>
            </h1>

            <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-[15px] text-white/90 font-normal leading-relaxed max-w-xl">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
