export function PostDetailSkeleton() {
  return (
    <div className="w-full bg-[#fafbfc] min-h-screen py-6 sm:py-8 lg:py-10">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 h-4 w-64 max-w-full rounded bg-gray-200 animate-pulse" />

        {/* 2-column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* Article Main Skeleton */}
          <div className="flex-1 min-w-0 bg-white rounded-2xl p-5 sm:p-8 lg:p-10 border border-gray-100 shadow-xs space-y-4">
            <div className="h-8 sm:h-10 w-11/12 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-48 rounded bg-gray-100 animate-pulse pb-4" />
            <div className="aspect-[16/9] w-full rounded-xl sm:rounded-2xl bg-gray-200 animate-pulse" />
            
            {/* TOC Skeleton */}
            <div className="h-32 w-full rounded-xl bg-gray-50 border border-gray-100 animate-pulse my-6" />

            <div className="space-y-3 pt-4">
              <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-11/12 rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="w-full lg:w-[380px] shrink-0 bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-4">
            <div className="h-5 w-44 rounded bg-gray-200 animate-pulse" />
            <div className="divide-y divide-gray-100 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 pt-3">
                  <div className="w-24 h-20 rounded-lg bg-gray-200 shrink-0 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
                    <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
                    <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggested Products Skeleton */}
        <div className="mt-14 pt-12 border-t border-gray-200 space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-7 w-64 rounded bg-gray-200 animate-pulse" />
            <div className="h-9 w-64 rounded bg-gray-100 animate-pulse hidden sm:block" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 p-2.5 space-y-3">
                <div className="aspect-[4/3] w-full rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
                <div className="h-8 w-full rounded bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
