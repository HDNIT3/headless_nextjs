import { getGalleryData } from '@/service/gallery.service';
import {
  filterGalleryItems,
  resolveGalleryTerm,
} from '@/lib/utils/gallery-filters';
import { GallerySection } from './gallery-section';

interface GalleryDataProps {
  activeSlug: string | null;
}

/**
 * Server component that owns the gallery fetch. It is rendered inside a
 * Suspense boundary so the hero can stream immediately.
 */
export async function GalleryData({ activeSlug }: GalleryDataProps) {
  const { items, terms } = await getGalleryData();
  const activeTerm = resolveGalleryTerm(terms, activeSlug);
  const selectedSlug = activeTerm?.slug ?? null;
  const filteredItems = filterGalleryItems(items, selectedSlug);

  return (
    <GallerySection
      items={filteredItems}
      terms={terms}
      activeSlug={selectedSlug}
    />
  );
}
