import Image from 'next/image';

export function ProductHeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#124d27]">
      <div className="relative w-full h-[220px] sm:h-[280px] md:h-[340px] lg:h-[380px]">
        <Image
          src="/images/product/product_banner.png"
          alt="Sản phẩm Bao Bì Đức Trọng"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d4520]/95 via-[#0d4520]/80 sm:via-[#0d4520]/60 to-transparent" />

        {/* Content */}
        <div className="relative h-full max-w-[1360px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col justify-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[36px] font-extrabold uppercase leading-[1.25] tracking-wide text-white drop-shadow-xs">
              <span className="block">SẢN PHẨM BAO BÌ</span>
              <span className="block mt-1 text-[#f5a623]">ĐỨC TRỌNG</span>
            </h1>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-[15px] text-white/90 font-normal leading-relaxed max-w-xl">
              Cho chúng tôi biết nhu cầu của bạn, Bao Bì Đức Trọng sẽ hỗ trợ tư vấn giải pháp và báo giá phù hợp cho từng đơn hàng. Chúng tôi luôn đồng hành cùng sự phát triển của nông sản Việt.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
