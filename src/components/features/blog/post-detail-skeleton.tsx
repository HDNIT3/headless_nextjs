export function PostDetailSkeleton() {
  return (
    <div className="w-full bg-[#fafbfc] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6 h-4 w-64 max-w-full rounded bg-gray-200 animate-pulse" />

        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-100 shadow-xs space-y-4">
          <div className="h-9 w-11/12 rounded bg-gray-200 animate-pulse" />
          <div className="h-9 w-3/4 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-40 rounded bg-gray-100 animate-pulse" />
          <div className="aspect-[16/9] w-full rounded-xl bg-gray-200 animate-pulse" />
          <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-11/12 rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-10/12 rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
