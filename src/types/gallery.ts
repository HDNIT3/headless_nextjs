import type { FeaturedImage } from './common';

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
