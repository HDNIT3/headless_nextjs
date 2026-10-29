import { PageTransition } from '@/components/common/page-transition';

export default function CartLoading() {
  return (
    <PageTransition>
      <div className="w-full bg-[#fafbfc] min-h-[calc(100vh-80px)] py-8 sm:py-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-44 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0 items-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 bg-gray-200 rounded-md animate-pulse" />
                    <div className="h-4 w-1/3 bg-gray-100 rounded-md animate-pulse" />
                    <div className="h-4 w-1/4 bg-gray-100 rounded-md animate-pulse" />
                  </div>
                  <div className="w-24 h-8 bg-gray-100 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>

            {}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse" />
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-12 w-full bg-emerald-100/60 rounded-xl animate-pulse mt-4" />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
