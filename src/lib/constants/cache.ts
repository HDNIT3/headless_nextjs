export const REVALIDATE_TIME = {
  DEFAULT: 60,
  POSTS: 60,
  PRODUCTS: 0, // 0 = Không cache, load trực tiếp từ backend
  CATEGORIES: 0, // 0 = Không cache danh mục
  GALLERY: 60,
  COUPONS: 0,
} as const;

export const DEFAULT_REVALIDATE = REVALIDATE_TIME.DEFAULT;
