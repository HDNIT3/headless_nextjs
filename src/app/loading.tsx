import { PageTransition } from '@/components/common/page-transition';

export default function RootLoading() {
  return (
    <PageTransition>
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
        <div className="relative flex items-center justify-center">
          {}
          <div className="w-16 h-16 rounded-full border-4 border-[#0c5c36]/20 border-t-[#0c5c36] animate-spin" />
          {}
          <div className="absolute w-3 h-3 rounded-full bg-[#f15a24] animate-pulse" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
          Đang tải nội dung...
        </p>
      </div>
    </PageTransition>
  );
}
