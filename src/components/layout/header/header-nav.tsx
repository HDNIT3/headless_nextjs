import { getProductCategories } from '@/service/category.service';
import { NavMenu } from './nav-menu';

/**
 * Async slice of the header. Keeping data fetching here lets the header shell
 * render immediately while categories stream in.
 */
export async function HeaderNav() {
  const categories = await getProductCategories();
  return <NavMenu categories={categories} />;
}
