export function ProductListSkeleton() {
  return (
    <div className="flex-1 min-w-0">
      <div className="mb-1 h-4 w-24 rounded bg-gray-200 animate-pulse" />
      <div className="mt-4 mb-5 h-7 w-64 max-w-full rounded bg-gray-200 animate-pulse" />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-100 p-2.5"
          >
            <div className="aspect-[4/3] w-full rounded-lg bg-gray-200 animate-pulse" />
            <div className="pt-2.5 px-0.5 pb-0.5 space-y-2">
              <div className="h-4 w-11/12 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-gray-100 animate-pulse" />
              <div className="mt-3 h-8 w-full rounded-md bg-gray-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductSidebarSkeleton() {
  return (
    <aside className="w-full lg:w-[300px] shrink-0 space-y-5">
      <div className="h-11 w-full rounded-lg bg-gray-200 animate-pulse" />
      <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-5">
        <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
        {Array.from({ length: 3 }).map((_, section) => (
          <div key={section} className="space-y-2.5">
            <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
            {Array.from({ length: 3 }).map((_, item) => (
              <div
                key={item}
                className="h-4 w-4/5 rounded bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ))}
        <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />
      </div>
    </aside>
  );
}
