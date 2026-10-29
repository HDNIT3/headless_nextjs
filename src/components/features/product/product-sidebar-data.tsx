import { getProductCategories } from '@/service/category.service';
import {
  getProductAttrKichThuocs,
  getProductAttrMauSacs,
} from '@/service/product.service';
import { ProductSidebarFilter } from './product-sidebar-filter';

export async function ProductSidebarData({
  filterKey,
}: {
  filterKey: string;
}) {
  const [categories, kichThuocs, mauSacs] = await Promise.all([
    getProductCategories(),
    getProductAttrKichThuocs(),
    getProductAttrMauSacs(),
  ]);

  return (
    <ProductSidebarFilter
      key={filterKey}
      categories={categories}
      kichThuocs={kichThuocs}
      mauSacs={mauSacs}
    />
  );
}
