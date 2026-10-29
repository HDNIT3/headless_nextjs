import type { ProductNode } from '@/types/product';

export const ITEMS_PER_PAGE = 12;

const KICH_THUOC_KEYWORDS = ['kich thuoc', 'kich co', 'size'];
const MAU_SAC_KEYWORDS = ['mau sac', 'mau', 'color'];

export type RawSearchParam = string | string[] | undefined;

export interface ProductSearchParams {
  page?: string;
  search?: string;
  danhmuc?: RawSearchParam;
  kichthuoc?: RawSearchParam;
  mausac?: RawSearchParam;
}

export interface ProductFilters {
  page: number;
  search?: string;
  categories: string[];
  kichThuocs: string[];
  mauSacs: string[];
}

function toArray(value: RawSearchParam): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function parseProductFilters(params: ProductSearchParams): ProductFilters {
  return {
    page: Math.max(1, Number(params.page) || 1),
    search: params.search?.trim() || undefined,
    categories: toArray(params.danhmuc),
    kichThuocs: toArray(params.kichthuoc),
    mauSacs: toArray(params.mausac),
  };
}

export function getPageCursor(page: number, perPage = ITEMS_PER_PAGE): string | null {
  if (page <= 1) return null;
  const offset = (page - 1) * perPage - 1;
  return Buffer.from(`arrayconnection:${offset}`).toString('base64');
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .trim();
}

function matchesAttributes(
  product: ProductNode,
  selected: string[],
  keywords: string[]
): boolean {
  if (selected.length === 0) return true;

  const selectedSet = new Set(selected.map(normalize));
  const attributes = product.attributes?.nodes ?? [];
  const scoped = attributes.filter((attr) =>
    keywords.some((keyword) => normalize(attr.name).includes(keyword))
  );
  // Fall back to every attribute when the store doesn't name them as expected.
  const candidates = scoped.length > 0 ? scoped : attributes;

  return candidates.some((attr) =>
    (attr.options ?? []).some((option) => selectedSet.has(normalize(option)))
  );
}

export function filterProducts(
  products: ProductNode[],
  filters: ProductFilters
): ProductNode[] {
  let filtered = products;

  if (filters.categories.length > 0) {
    filtered = filtered.filter((product) =>
      product.productCategories?.nodes?.some(
        (category) =>
          filters.categories.includes(category.name) ||
          (category.slug && filters.categories.includes(category.slug))
      )
    );
  }

  if (filters.kichThuocs.length > 0) {
    filtered = filtered.filter((product) =>
      matchesAttributes(product, filters.kichThuocs, KICH_THUOC_KEYWORDS)
    );
  }

  if (filters.mauSacs.length > 0) {
    filtered = filtered.filter((product) =>
      matchesAttributes(product, filters.mauSacs, MAU_SAC_KEYWORDS)
    );
  }

  return filtered;
}
