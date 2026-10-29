import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageTransition } from '@/components/common/page-transition';
import { LazySection } from '@/components/common/lazy-section';
import { ProductDetailInfo } from '@/components/features/product/product-detail-info';
import { ProductDetailTabs } from '@/components/features/product/product-detail-tabs';
import { ProductGallery } from '@/components/features/product/product-gallery';
import { ProductShareButton } from '@/components/features/product/product-share-button';
import { getProductDetail } from '@/service/product.service';
import { getProductSpecs } from '@/lib/utils/product';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetail(slug);

  if (!product) {
    return {
      title: 'Sản phẩm không tồn tại | Bao Bì Đức Trọng',
    };
  }

  return {
    title: `${product.name} | Bao Bì Đức Trọng`,
    description:
      product.thongtinsanpham?.congdung ||
      `${product.name} - Sản phẩm bao bì chất lượng cao từ Bao Bì Đức Trọng.`,
    openGraph: product.image?.sourceUrl
      ? { images: [product.image.sourceUrl] }
      : undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductDetail(slug);

  if (!product) {
    notFound();
  }

  const specs = getProductSpecs(product);
  const info = product.thongtinsanpham;
  const categories = product.productCategories?.nodes ?? [];
  const views = info?.luTXem ?? 0;

  return (
    <PageTransition>
      <div className="w-full bg-white">
        <div className="mx-auto max-w-[1360px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {/* Breadcrumb + meta */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] sm:text-sm"
            >
              <Link
                href="/san-pham"
                transitionTypes={['nav-back']}
                className="font-medium text-[#0c5c36] hover:underline"
              >
                Sản phẩm
              </Link>

              {categories.map((category) => (
                <span key={category.id} className="flex items-center gap-2">
                  <span className="text-gray-400">/</span>
                  <Link
                    href={`/san-pham?danhmuc=${encodeURIComponent(category.slug)}`}
                    transitionTypes={['nav-back']}
                    className="text-[#0c5c36] hover:underline"
                  >
                    {category.name}
                  </Link>
                </span>
              ))}

              <span className="text-gray-400">/</span>
              <span className="font-semibold text-gray-900">{product.name}</span>
            </nav>

            <div className="flex shrink-0 items-center gap-3 text-[13px] text-gray-600">
              <span className="inline-flex items-center gap-1.5">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                {views.toLocaleString('vi-VN')} lượt xem
              </span>

              <span className="h-4 w-px bg-gray-300" />

              <ProductShareButton title={product.name} />
            </div>
          </div>

          {/* Gallery + product info */}
          <div className="mt-5 grid grid-cols-1 gap-8 lg:mt-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10">
            <ProductGallery key={product.id} product={product} />
            <ProductDetailInfo product={product} />
          </div>

          {/* Detail tabs - Lazy load khi người dùng cuộn xuống */}
          <div className="mt-10 lg:mt-12">
            <LazySection
              minHeight="240px"
              rootMargin="150px"
              fallback={
                <div className="space-y-4">
                  <div className="h-10 w-full max-w-md rounded bg-gray-200 animate-pulse" />
                  <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
                  <div className="h-4 w-11/12 rounded bg-gray-100 animate-pulse" />
                  <div className="h-4 w-10/12 rounded bg-gray-100 animate-pulse" />
                </div>
              }
            >
              <ProductDetailTabs
                key={product.id}
                name={product.name}
                specs={specs}
                congDung={info?.congdung}
                applicationsHtml={info?.ungdungchitiet}
                whyHtml={info?.visaonensudung}
              />
            </LazySection>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
