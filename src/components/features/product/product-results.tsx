import { getProducts } from '@/service/product.service';
import { ProductListSection } from './product-list-section';
import {
  filterProducts,
  getPageCursor,
  ITEMS_PER_PAGE,
  type ProductFilters,
} from '@/lib/utils/product-filters';

interface ProductResultsProps {
  filters: ProductFilters;
}

/**
 * Async product grid. It is rendered inside Suspense by the page so the hero
 * and filter shell can paint before WPGraphQL responds.
 */
export async function ProductResults({ filters }: ProductResultsProps) {
  const productsData = await getProducts({
    first: ITEMS_PER_PAGE,
    after: getPageCursor(filters.page),
    search: filters.search,
  });

  const products = filterProducts(productsData.products.nodes, filters);
  const totalPages = productsData.products.pageInfo.hasNextPage
    ? filters.page + 1
    : filters.page;

  return (
    <ProductListSection
      products={products}
      pageInfo={productsData.products.pageInfo}
      currentPage={filters.page}
      totalPages={totalPages}
      activeCategory={filters.categories.join(', ')}
    />
  );
}
