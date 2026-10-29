import { PageTransition } from '@/components/common/page-transition';

export default function CheckoutLoading() {
  return (
    <PageTransition>
      <div className="w-full bg-[#fafbfc] min-h-[calc(100vh-80px)] py-8 sm:py-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {}
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <span className="text-gray-300">/</span>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
              <div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse" />
              <div className="space-y-4">
                <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
                  <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
                </div>
                <div className="h-24 w-full bg-gray-100 rounded-xl animate-pulse" />
              </div>
            </div>

            {}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
              <div className="h-6 w-40 bg-gray-200 rounded-lg animate-pulse" />
              <div className="space-y-4 border-y border-gray-100 py-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex justify-between items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-1/3 bg-gray-100 rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="h-12 w-full bg-emerald-100/70 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
