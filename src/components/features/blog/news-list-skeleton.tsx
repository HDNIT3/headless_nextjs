export function NewsListSkeleton() {
  return (
    <section className="w-full bg-[#fafbfc] py-12 sm:py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="mx-auto h-8 w-72 max-w-full rounded bg-gray-200 animate-pulse" />
          <div className="mx-auto mt-4 h-4 w-full max-w-xl rounded bg-gray-200/80 animate-pulse" />
          <div className="mx-auto mt-2 h-4 w-4/5 max-w-lg rounded bg-gray-200/80 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-100 p-3.5"
            >
              <div className="aspect-[4/3] w-full rounded-xl bg-gray-200 animate-pulse" />
              <div className="pt-3.5 px-1 pb-1 space-y-2.5">
                <div className="h-4 w-11/12 rounded bg-gray-200 animate-pulse" />
                <div className="h-4 w-4/5 rounded bg-gray-200 animate-pulse" />
                <div className="h-3 w-full rounded bg-gray-100 animate-pulse" />
                <div className="h-3 w-10/12 rounded bg-gray-100 animate-pulse" />
                <div className="h-3 w-2/3 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
