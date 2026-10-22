import { cache } from 'react';
import { fetchGraphQL } from '@/lib/wordpress/graphql-client';
import { GET_GALLERY_QUERY } from '@/lib/wordpress/queries/gallery.graphql';
import type { GalleryData, GetGalleryResponse } from '@/types/gallery';

/**
 * Loads the gallery posts and their taxonomy terms in one request. The result
 * is cached for 60 seconds and tagged so it can be revalidated on demand.
 *
 * A failed WordPress request degrades to an empty gallery instead of throwing,
 * which lets the page render its empty state.
 */
export const getGalleryData = cache(async (): Promise<GalleryData> => {
  const data = await fetchGraphQL<GetGalleryResponse>(
    GET_GALLERY_QUERY,
    { first: 100 },
    { revalidate: 60, tags: ['gallery', 'gallery-terms'] }
  );

  return {
    items: data?.allDanhSChNh?.nodes || [],
    terms: data?.allPhNLoINh?.nodes || [],
  };
});
