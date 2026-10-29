import { PageTransition } from '@/components/common/page-transition';

export default function ProfileLoading() {
  return (
    <PageTransition>
      <div className="w-full bg-[#fafbfc] min-h-[calc(100vh-80px)] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {}
          <div className="flex items-center gap-2 mb-8">
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            <span className="text-gray-300">/</span>
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          </div>

          {}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-36 sm:h-44 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse relative">
              <div className="absolute -bottom-12 left-6 sm:left-10 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1 shadow-md border border-gray-100">
                <div className="w-full h-full rounded-xl bg-gray-200 animate-pulse" />
              </div>
            </div>

            <div className="pt-16 p-6 sm:p-10 space-y-8">
              <div className="space-y-2 pb-6 border-b border-gray-100">
                <div className="h-8 w-56 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-4 w-40 bg-gray-100 rounded-md animate-pulse" />
              </div>

              {}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
