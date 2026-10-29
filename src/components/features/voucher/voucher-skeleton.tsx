export function VoucherListSkeleton() {
  return (
    <div className="space-y-4">
      {}
      <div className="flex gap-2 py-4 border-b border-gray-100 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-28 bg-gray-200 rounded-xl" />
        ))}
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs animate-pulse"
          >
            <div className="h-40 md:h-auto md:w-[190px] bg-gray-100" />
            <div className="flex-1 p-5 space-y-3">
              <div className="h-5 w-3/4 bg-gray-200 rounded-sm" />
              <div className="h-4 w-full bg-gray-100 rounded-sm" />
              <div className="h-4 w-1/2 bg-gray-100 rounded-sm" />
              <div className="pt-4 flex justify-between items-center">
                <div className="h-7 w-24 bg-gray-200 rounded-lg" />
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-gray-200 rounded-lg" />
                  <div className="h-8 w-20 bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
