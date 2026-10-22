export function GallerySkeleton() {
  return (
    <section
      className="w-full bg-white py-12 sm:py-16 lg:py-20"
      role="status"
      aria-label="Đang tải hình ảnh"
    >
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto h-8 w-72 max-w-full rounded bg-gray-200 animate-pulse sm:h-9 lg:h-10" />
          <div className="mx-auto mt-4 h-4 w-full max-w-[520px] rounded bg-gray-200/80 animate-pulse" />
          <div className="mx-auto mt-2 h-4 w-4/5 max-w-[440px] rounded bg-gray-200/80 animate-pulse" />
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-24 rounded-full bg-gray-200/80 animate-pulse sm:h-11 sm:w-28"
            />
          ))}
        </div>

        <div className="mx-auto mt-10 w-full sm:mt-12 lg:mt-14 lg:w-[63%] lg:max-w-[900px]">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-[30px]">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className={`h-[260px] rounded-[11px] bg-gray-200 animate-pulse sm:h-[300px] lg:h-[354px] ${
                  index === 0 ? 'lg:col-span-2' : ''
                }`}
              />
            ))}
          </div>
        </div>

        <span className="sr-only">Đang tải hình ảnh...</span>
      </div>
    </section>
  );
}
