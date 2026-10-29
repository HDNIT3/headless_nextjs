import { getProductCategories } from '@/service/category.service';
import { NavMenu } from './nav-menu';

export async function HeaderNav() {
  const categories = await getProductCategories();
  return <NavMenu categories={categories} />;
}
