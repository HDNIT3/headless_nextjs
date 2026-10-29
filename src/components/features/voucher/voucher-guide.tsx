export function VoucherGuide() {
  const steps = [
    {
      step: '01',
      title: 'Chọn & Sao chép mã',
      description: 'Tìm mã giảm giá phù hợp với nhu cầu và nhấn nút "Sao chép mã".',
      icon: (
        <svg className="w-6 h-6 text-[#0f5c2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      ),
    },
    {
      step: '02',
      title: 'Chọn mua bao bì',
      description: 'Lựa chọn các loại thùng xốp, khay xốp hoặc phụ kiện cần mua vào giỏ hàng.',
      icon: (
        <svg className="w-6 h-6 text-[#0f5c2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      step: '03',
      title: 'Dán mã tại thanh toán',
      description: 'Nhập hoặc dán mã ưu đãi vào ô "Mã giảm giá" tại bước thanh toán.',
      icon: (
        <svg className="w-6 h-6 text-[#0f5c2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      step: '04',
      title: 'Nhận chiết khấu ngay',
      description: 'Hệ thống tự động trừ tiền đơn hàng hoặc miễn phí cước vận chuyển tức thì.',
      icon: (
        <svg className="w-6 h-6 text-[#0f5c2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="mt-16 sm:mt-20 pt-12 border-t border-gray-200">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold tracking-widest text-[#0f5c2e] uppercase">
          Quy trình áp dụng
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
          Cách sử dụng mã giảm giá đơn giản
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">
          Chỉ với 4 bước đơn giản để tối ưu chi phí bao bì nông sản cho doanh nghiệp của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item, index) => (
          <div
            key={index}
            className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col items-start"
          >
            {}
            <div className="flex items-center justify-between w-full mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-2xl font-black text-gray-200 tracking-tighter">
                {item.step}
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-1.5">{item.title}</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
