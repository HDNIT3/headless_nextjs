import type { FeaturedImage } from './common';

/**
 * Term of the `phan-loai-anh` taxonomy.
 *
 * WPGraphQL exposes this custom taxonomy through Vietnamese-derived GraphQL
 * names, so the field names in the query file look unusual. The rest of the
 * app only sees this clean type.
 */
export interface GalleryTerm {
  databaseId: number;
  name: string;
  slug: string;
  count?: number | null;
}

export interface GalleryItem {
  databaseId: number;
  title: string;
  slug: string;
  date?: string | null;
  uri?: string | null;
  featuredImage?: FeaturedImage | null;
  /** Taxonomy connection returned by WPGraphQL for `phan-loai-anh`. */
  phNLoINh?: {
    nodes: GalleryTerm[];
  } | null;
}

export interface GalleryData {
  items: GalleryItem[];
  terms: GalleryTerm[];
}

export interface GetGalleryResponse {
  allDanhSChNh?: {
    nodes: GalleryItem[];
  } | null;
  allPhNLoINh?: {
    nodes: GalleryTerm[];
  } | null;
}
