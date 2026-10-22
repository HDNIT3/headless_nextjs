import { getProductCategories } from '@/service/category.service';
import { MobileNav } from './mobile-nav';

export async function HeaderMobileNav() {
  const categories = await getProductCategories();
  return <MobileNav categories={categories} />;
}
