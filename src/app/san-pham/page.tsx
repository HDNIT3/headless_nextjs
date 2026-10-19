import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ProductHeroBanner } from '@/components/features/product/product-hero-banner';
import { ProductListSection } from '@/components/features/product/product-list-section';
import { ProductSidebarFilter } from '@/components/features/product/product-sidebar-filter';
import { getProducts } from '@/service/product.service';
import { getProductCategories } from '@/service/category.service';
import { getProductAttrKichThuocs, getProductAttrMauSacs } from '@/service/product.service';
import type { ProductNode } from '@/types/product';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sản phẩm | Bao Bì Đức Trọng',
  description:
    'Khám phá các sản phẩm bao bì chất lượng cao từ Bao Bì Đức Trọng. Thùng xốp, hộp xốp, khay nhựa và nhiều hơn nữa.',
};

const ITEMS_PER_PAGE = 12;

function getPageCursor(page: number, perPage: number): string | null {
  if (page <= 1) return null;
  const offset = (page - 1) * perPage - 1;
  return Buffer.from(`arrayconnection:${offset}`).toString('base64');
}

interface SanPhamPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    danhmuc?: string | string[];
    kichthuoc?: string | string[];
    mausac?: string | string[];
  }>;
}

export default async function SanPhamPage({ searchParams }: SanPhamPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);
  const searchTerm = params.search || undefined;

  // Parse filter arrays
  const selectedCategories = Array.isArray(params.danhmuc)
    ? params.danhmuc
    : params.danhmuc
      ? [params.danhmuc]
      : [];
  const selectedKichThuocs = Array.isArray(params.kichthuoc)
    ? params.kichthuoc
    : params.kichthuoc
      ? [params.kichthuoc]
      : [];
  const selectedMauSacs = Array.isArray(params.mausac)
    ? params.mausac
    : params.mausac
      ? [params.mausac]
      : [];

  // Tính cursor từ số trang
  const afterCursor = getPageCursor(currentPage, ITEMS_PER_PAGE);

  // Fetch all data in parallel
  const [productsData, categories, kichThuocs, mauSacs] = await Promise.all([
    getProducts({
      first: ITEMS_PER_PAGE,
      after: afterCursor,
      search: searchTerm,
    }),
    getProductCategories(),
    getProductAttrKichThuocs(),
    getProductAttrMauSacs(),
  ]);

  // Client-side filtering for attributes
  let filteredProducts: ProductNode[] = productsData.products.nodes;

  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      p.productCategories?.nodes?.some(
        (c) =>
          selectedCategories.includes(c.name) ||
          (c.slug && selectedCategories.includes(c.slug))
      )
    );
  }
  if (selectedKichThuocs.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      p.productAttrKichThuocs?.nodes?.some((k) => selectedKichThuocs.includes(k.name))
    );
  }
  if (selectedMauSacs.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      p.productAttrMauSacs?.nodes?.some((m) => selectedMauSacs.includes(m.name))
    );
  }

  // Tính tổng số trang:
  // - Nếu trang hiện tại có đủ ITEMS_PER_PAGE và hasNextPage → có thêm trang
  // - Nếu không đủ hoặc không có hasNextPage → trang cuối
  const hasNextPage = productsData.products.pageInfo.hasNextPage;
  const totalPages = hasNextPage ? currentPage + 1 : currentPage;

  return (
    <div className="w-full flex flex-col">
      <ProductHeroBanner />

      <section className="w-full bg-[#fafbfc] py-8 sm:py-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <ProductListSection
              products={filteredProducts}
              pageInfo={productsData.products.pageInfo}
              currentPage={currentPage}
              totalPages={totalPages}
              activeCategory={selectedCategories.join(', ')}
            />

            {/* Sidebar */}
            <Suspense fallback={<div className="w-full lg:w-[300px] shrink-0" />}>
              <ProductSidebarFilter
                categories={categories}
                kichThuocs={kichThuocs}
                mauSacs={mauSacs}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
