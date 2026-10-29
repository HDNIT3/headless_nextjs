import { cache } from 'react';
import { fetchGraphQL } from '@/lib/wordpress/graphql-client';
import { GET_GALLERY_QUERY } from '@/lib/wordpress/queries/gallery.graphql';
import type { GalleryData, GetGalleryResponse } from '@/types/gallery';
import { REVALIDATE_TIME } from '@/lib/constants/cache';

export const getGalleryData = cache(async (): Promise<GalleryData> => {
  const data = await fetchGraphQL<GetGalleryResponse>(
    GET_GALLERY_QUERY,
    { first: 100 },
    { revalidate: REVALIDATE_TIME.GALLERY, tags: ['gallery', 'gallery-terms'] }
  );

  return {
    items: data?.allDanhSChNh?.nodes || [],
    terms: data?.allPhNLoINh?.nodes || [],
  };
});
