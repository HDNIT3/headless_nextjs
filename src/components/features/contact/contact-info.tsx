import Image from 'next/image';

export function ContactInfo() {
  return (
    <div className="flex flex-col justify-between h-full">
      {/* Top Header & Contact Details */}
      <div>
        <div className="space-y-1 sm:space-y-1.5">
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-tight">
            <span className="text-[#0c5c36]">BAO BÌ</span>{' '}
            <span className="text-[#f15a24]">ĐỨC TRỌNG</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-[19px] font-bold text-[#0c5c36] tracking-wide uppercase">
            GIẢI PHÁP BAO BÌ TOÀN DIỆN CHO NÔNG SẢN
          </p>
        </div>

        {/* Contact List */}
        <ul className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3 text-sm sm:text-[14.5px] text-gray-800 font-medium">
          <li className="flex items-start gap-2.5">
            <span className="text-black text-lg leading-none select-none">•</span>
            <div>
              <span className="font-bold text-gray-900">Địa Chỉ:</span>{' '}
              <span className="text-gray-700">
                40 Tô Vĩnh Diện, Liên Nghĩa, Đức Trọng, Lâm Đồng
              </span>
            </div>
          </li>

          <li className="flex items-start gap-2.5">
            <span className="text-black text-lg leading-none select-none">•</span>
            <div>
              <span className="font-bold text-gray-900">Hotline:</span>{' '}
              <a
                href="tel:0986124330"
                className="text-gray-700 hover:text-[#0c5c36] transition-colors"
              >
                0986.124.330
              </a>
              {' - '}
              <a
                href="tel:0909615396"
                className="text-gray-700 hover:text-[#0c5c36] transition-colors"
              >
                0909.615.396
              </a>
            </div>
          </li>

          <li className="flex items-start gap-2.5">
            <span className="text-black text-lg leading-none select-none">•</span>
            <div>
              <span className="font-bold text-gray-900">Email:</span>{' '}
              <a
                href="mailto:ungthithuyhuong1978@gmail.com"
                className="text-gray-700 hover:text-[#0c5c36] transition-colors"
              >
                ungthithuyhuong1978@gmail.com
              </a>
            </div>
          </li>

          <li className="flex items-start gap-2.5">
            <span className="text-black text-lg leading-none select-none">•</span>
            <div>
              <span className="font-bold text-gray-900">Website:</span>{' '}
              <a
                href="https://baobihuongquang.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-[#0c5c36] transition-colors"
              >
                baobihuongquang.com
              </a>
            </div>
          </li>
        </ul>
      </div>

      {/* 3D Product Mockup Showcase */}
      <div className="relative my-6 sm:my-8 flex justify-center items-center">
        <div className="relative w-full max-w-[460px] aspect-square transition-transform hover:scale-[1.02] duration-300">
          <Image
            src="/images/contact/contact_image.png"
            alt="Bao Bì Đức Trọng - Giải pháp bao bì toàn diện cho nông sản"
            fill
            sizes="(max-width: 768px) 100vw, 460px"
            className="object-contain drop-shadow-md"
            priority
          />
        </div>
      </div>

      {/* 3 Bottom Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Feature 1: Đạt chất lượng */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#f15a24] fill-current"
              viewBox="0 0 24 24"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-snug">
              Đạt chất lượng
            </h4>
            <p className="text-xs text-gray-500">Sản phẩm đúng quy cách</p>
          </div>
        </div>

        {/* Feature 2: Hỗ trợ 24/7 */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#f15a24]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-snug">
              Hỗ trợ 24/7
            </h4>
            <p className="text-xs text-gray-500">Đồng hành lâu dài</p>
          </div>
        </div>

        {/* Feature 3: Nhanh chóng */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#f15a24] fill-current"
              viewBox="0 0 24 24"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900 leading-snug">
              Nhanh chóng
            </h4>
            <p className="text-xs text-gray-500">Linh hoạt theo đơn hàng</p>
          </div>
        </div>
      </div>
    </div>
  );
}
