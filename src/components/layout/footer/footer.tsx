import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="mt-auto bg-[#f3f9f5] border-t border-[#e3efe7] text-[#334155]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-10 sm:pb-12">
        {/* Top Header: Logo & Social Media Icons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 pb-6">
          {/* Brand Logo */}
          <Link href="/" className="inline-flex items-center gap-3.5 group">
            {/* Cropped emblem from site_icon.png */}
            <div className="relative w-[52px] h-[52px] overflow-hidden flex-shrink-0">
              <Image
                src="/icons/site_icon.png"
                alt="Bao Bì Đức Trọng"
                width={180}
                height={68}
                className="absolute left-0 top-0 h-full w-auto max-w-none object-cover object-left"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xl sm:text-2xl font-black tracking-tight leading-none">
                <span className="text-[#0c5c36]">BAO BÌ</span>
                <span className="text-[#e85817]">ĐỨC TRỌNG</span>
              </div>
              <p className="text-xs sm:text-[13px] text-[#0c5c36] font-medium tracking-wide mt-1.5">
                Giải pháp an toàn cho nông sản Việt
              </p>
            </div>
          </Link>

          {/* Social Icons */}
          <div className="flex items-center gap-3.5">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#1877F2] transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-[#FF0000] transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

            {/* Zalo */}
            <a
              href="https://zalo.me/0986124330"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Zalo"
              className="w-8 h-8 rounded-full border border-black text-black flex items-center justify-center hover:bg-[#0068FF] hover:border-[#0068FF] hover:text-white transition-all text-[11px] font-bold tracking-tight"
            >
              Zalo
            </a>

            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Golden / Amber Divider Line */}
        <div className="w-full h-px bg-[#d8a86a]/70 my-5 sm:my-6" />

        {/* Main Content Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 pt-2">
          {/* Column 1: THÔNG TIN LIÊN HỆ */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm sm:text-[15px] font-bold text-[#c2651b] uppercase tracking-wide mb-4">
                THÔNG TIN LIÊN HỆ
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-[13px] text-[#334155]">
                {/* Address */}
                <li className="flex items-start gap-2.5">
                  <svg
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-800 flex-shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="leading-snug">
                    40 Tô Vĩnh Diện, Phường Đức Trọng, Tỉnh Lâm Đồng
                  </span>
                </li>

                {/* Phone */}
                <li className="flex items-center gap-2.5">
                  <svg
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-800 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <a
                    href="tel:0986124330"
                    className="hover:text-[#c2651b] transition-colors leading-snug font-medium"
                  >
                    (+84) 986 124 330
                  </a>
                </li>

                {/* Email / Website */}
                <li className="flex items-center gap-2.5">
                  <svg
                    className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-gray-800 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <a
                    href="https://baobihuongquang.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#c2651b] transition-colors leading-snug"
                  >
                    baobihuongquang.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div className="mt-8 text-[11px] sm:text-xs text-gray-500 leading-relaxed">
              Copyright @ 2026 Bao Bì Đức Trọng. All rights reserved. Design by HomeNest.Software
            </div>
          </div>

          {/* Column 2: THÔNG TIN CHÍNH SÁCH */}
          <div className="md:col-span-3">
            <h3 className="text-sm sm:text-[15px] font-bold text-[#c2651b] uppercase tracking-wide mb-4">
              THÔNG TIN CHÍNH SÁCH
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#334155]">
              <li>
                <Link
                  href="/ve-chung-toi"
                  className="hover:text-[#0c5c36] hover:translate-x-1 transition-all inline-block"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  href="/lien-he"
                  className="hover:text-[#0c5c36] hover:translate-x-1 transition-all inline-block"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-mat"
                  className="hover:text-[#0c5c36] hover:translate-x-1 transition-all inline-block"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-hanh"
                  className="hover:text-[#0c5c36] hover:translate-x-1 transition-all inline-block"
                >
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-giao-hang"
                  className="hover:text-[#0c5c36] hover:translate-x-1 transition-all inline-block"
                >
                  Chính sách giao và đặt hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Google Map */}
          <div className="md:col-span-4">
            <div className="w-full h-[185px] sm:h-[195px] rounded-lg overflow-hidden border border-gray-200/90 shadow-xs bg-gray-100">
              <iframe
                title="Bản đồ Bao Bì Đức Trọng"
                src="https://maps.google.com/maps?q=40%20T%C3%B4%20V%C4%A9nh%20Di%E1%BB%87n,%20%C4%90%E1%BB%A9c%20Tr%E1%BB%8Dng,%20L%C3%A2m%20%C4%90%E1%BB%93ng&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
