import type { GalleryItem, GalleryTerm } from '@/types/gallery';

export const GALLERY_INITIAL_VISIBLE = 7;
export const GALLERY_LOAD_MORE_STEP = 7;

export type RawGallerySearchParam = string | string[] | undefined;

export interface GallerySearchParams {
  phanloai?: RawGallerySearchParam;
}

export interface GalleryFilters {
  categorySlug: string | null;
}

function firstValue(value: RawGallerySearchParam): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  const slug = raw?.trim();
  return slug || null;
}

/** Normalises the URL search params into the gallery filter state. */
export function parseGalleryFilters(
  params: GallerySearchParams
): GalleryFilters {
  return {
    categorySlug: firstValue(params.phanloai),
  };
}

/** Resolves a slug against the real terms so invalid URLs fall back to "all". */
export function resolveGalleryTerm(
  terms: GalleryTerm[],
  slug: string | null
): GalleryTerm | null {
  if (!slug) return null;
  return terms.find((term) => term.slug === slug) ?? null;
}

export function filterGalleryItems(
  items: GalleryItem[],
  categorySlug: string | null
): GalleryItem[] {
  if (!categorySlug) return items;

  return items.filter((item) =>
    item.phNLoINh?.nodes?.some((term) => term.slug === categorySlug)
  );
}
