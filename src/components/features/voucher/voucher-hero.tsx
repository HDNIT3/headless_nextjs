interface VoucherHeroProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export function VoucherHero({ searchQuery = '', onSearchChange }: VoucherHeroProps) {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#0c4a24] via-[#0f5c2e] to-[#146b38] py-12 sm:py-16 text-white">
      {}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#f15a24]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none" />

      <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-emerald-200 mb-5 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-[#f15a24] animate-pulse" />
            <span>Kho Ưu Đãi Độc Quyền 2026</span>
          </div>

          {}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white drop-shadow-xs">
            Mã Giảm Giá &amp; Khuyến Mãi <br />
            <span className="text-[#fca311] inline-block mt-1">Bao Bì Đức Trọng</span>
          </h1>

          {}
          <p className="mt-4 text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
            Lưu ngay mã ưu đãi để tiết kiệm chi phí đóng gói nông sản, thùng xốp xuất khẩu, khay xốp và phụ kiện bảo quản. Áp dụng dễ dàng khi đặt hàng trực tuyến hoặc qua hotline.
          </p>

          {}
          {onSearchChange && (
            <div className="mt-8 w-full max-w-lg">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Nhập mã ưu đãi hoặc tên khuyến mãi (VD: BANMOI, FREESHIP...)"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-3 focus:ring-[#f15a24]/50 shadow-lg border border-transparent transition-all"
                />
                <svg
                  className="absolute left-4 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3.5 p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none"
                    aria-label="Xóa tìm kiếm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {}
          <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-xl text-center">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-lg sm:text-2xl font-bold text-white">Lên tới 15%</div>
              <div className="text-xs text-emerald-200 mt-0.5">Giảm theo đơn</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-lg sm:text-2xl font-bold text-[#fca311]">0 VNĐ</div>
              <div className="text-xs text-emerald-200 mt-0.5">Phí giao hàng</div>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-lg sm:text-2xl font-bold text-white">500.000đ</div>
              <div className="text-xs text-emerald-200 mt-0.5">Ưu đãi khách sỉ</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
