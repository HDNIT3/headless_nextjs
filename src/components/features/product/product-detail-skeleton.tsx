export function ProductDetailSkeleton() {
  return (
    <div className="w-full bg-white">
      <div className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-4 w-64 max-w-full rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-32 rounded bg-gray-200 animate-pulse" />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-8 lg:mt-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10">
          <div className="aspect-[4/3] w-full rounded-2xl bg-gray-200 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-4/5 rounded bg-gray-200 animate-pulse" />
            <div className="h-5 w-1/3 rounded bg-gray-100 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
            <div className="h-4 w-11/12 rounded bg-gray-100 animate-pulse" />
            <div className="h-4 w-10/12 rounded bg-gray-100 animate-pulse" />
            <div className="mt-6 h-12 w-48 rounded-lg bg-gray-200 animate-pulse" />
          </div>
        </div>

        <div className="mt-10 lg:mt-12 space-y-4">
          <div className="h-10 w-full max-w-md rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-11/12 rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-10/12 rounded bg-gray-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
