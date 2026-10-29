'use client';

import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/use-in-view';
import {
  fetchProductSidebarDataAction,
  type ProductSidebarDataResult,
} from '@/actions/section.actions';
import { ProductSidebarFilter } from './product-sidebar-filter';
import { ProductSidebarSkeleton } from './product-list-skeleton';

interface LazyProductSidebarProps {
  filterKey?: string;
  initialData?: ProductSidebarDataResult | null;
}

export function LazyProductSidebar({
  filterKey,
  initialData = null,
}: LazyProductSidebarProps) {
  const { ref, isInView } = useInView<HTMLDivElement>({
    rootMargin: '250px',
    triggerOnce: true,
  });

  const [data, setData] = useState<ProductSidebarDataResult | null>(initialData);

  useEffect(() => {
    // Nếu đã có data hoặc chưa cuộn vào tầm nhìn thì không fetch
    if (data || !isInView) return;

    let isMounted = true;

    fetchProductSidebarDataAction()
      .then((res) => {
        if (isMounted) {
          setData(res);
        }
      })
      .catch((err) => {
        console.error('Lỗi tải dữ liệu sidebar:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isInView, data]);

  return (
    <div ref={ref} className="w-full lg:w-[300px] shrink-0 min-h-[450px]">
      {!data ? (
        <ProductSidebarSkeleton />
      ) : (
        <ProductSidebarFilter
          key={filterKey}
          categories={data.categories}
          kichThuocs={data.kichThuocs}
          mauSacs={data.mauSacs}
        />
      )}
    </div>
  );
}

