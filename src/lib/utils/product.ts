import type { ProductDetailNode } from '@/types/product';

export interface ProductSpec {
  label: string;
  value: string;
}

const OPTION_WORDS: Record<string, string> = {
  tuy: 'Tùy',
  chinh: 'chỉnh',
  theo: 'theo',
  nhu: 'nhu',
  cau: 'cầu',
  trang: 'Trắng',
  den: 'Đen',
  do: 'Đỏ',
  xanh: 'Xanh',
  vang: 'Vàng',
  hong: 'Hồng',
  xam: 'Xám',
  nau: 'Nâu',
  tim: 'Tím',
  cam: 'Cam',
};

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .trim();
}

function getAttributeOptions(
  product: ProductDetailNode,
  keywords: string[]
): string[] {
  const attributes = product.attributes?.nodes ?? [];
  const attribute = attributes.find((item) =>
    keywords.some((keyword) => normalize(item.name).includes(keyword))
  );

  return attribute?.options ?? [];
}

function formatOption(option: string): string {
  const words = option.replace(/[-_]+/g, ' ').trim().split(/\s+/);

  return words
    .map((word, index) => {
      const mapped = OPTION_WORDS[word.toLowerCase()];
      const text = mapped ?? word;
      return index === 0 ? text.charAt(0).toUpperCase() + text.slice(1) : text;
    })
    .join(' ');
}

function withUnit(value: string, unit: string): string {
  const trimmed = value.trim();
  return /[a-zA-Z]/.test(trimmed) ? trimmed : `${trimmed}${unit}`;
}

export function getProductSpecs(product: ProductDetailNode): ProductSpec[] {
  const info = product.thongtinsanpham;
  const sizes = getAttributeOptions(product, ['kich thuoc', 'kich co', 'size']);
  const colors = getAttributeOptions(product, ['mau sac', 'mau', 'color']);

  const specs: (ProductSpec | null)[] = [
    sizes.length > 0
      ? {
          label: 'Kích thước sản phẩm (Dài x Rộng x Cao)',
          value: sizes.join(', '),
        }
      : null,
    info?.chatlieu ? { label: 'Chất liệu', value: info.chatlieu } : null,
    info?.doday
      ? { label: 'Độ dày (Số lớp)', value: `Khoảng ${withUnit(info.doday, 'mm')}` }
      : null,
    info?.taitrong
      ? {
          label: 'Tải trọng',
          value: `Khoảng ${withUnit(info.taitrong, 'kg/thùng')}`,
        }
      : null,
    info?.congdung ? { label: 'Công dụng', value: info.congdung } : null,
    colors.length > 0
      ? {
          label: 'Màu sắc sản phẩm',
          value: colors.map(formatOption).join(', '),
        }
      : null,
  ];

  return specs.filter((spec): spec is ProductSpec => spec !== null);
}
