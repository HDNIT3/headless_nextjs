import { replaceMediaUrlsInHtml } from '@/lib/utils/media';

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
  subItems?: TocItem[];
}

export interface ParseTocResult {
  toc: TocItem[];
  modifiedHtml: string;
}

/**
 * Phân tích mã HTML bài viết để trích xuất các thẻ H2, H3 làm mục lục (Table of Contents),
 * đồng thời gán id tương ứng vào thẻ heading để hỗ trợ cuộn mượt (smooth scroll).
 * Đồng thời chuẩn hóa toàn bộ URL ảnh backend thành Frontend URI relative path (/wp-content/...).
 */
export function parseTableOfContents(html?: string | null): ParseTocResult {
  if (!html) {
    return { toc: [], modifiedHtml: '' };
  }

  // Chuẩn hóa toàn bộ URL ảnh WordPress backend thành Frontend URI
  const contentWithFeImages = replaceMediaUrlsInHtml(html);

  const headingRegex = /<(h[23])([^>]*)>(.*?)<\/\1>/gi;
  const toc: TocItem[] = [];
  let currentH2: TocItem | null = null;
  let counter = 0;

  const modifiedHtml = contentWithFeImages.replace(headingRegex, (match, tag, attrs, text) => {
    counter++;
    const cleanText = text.replace(/<[^>]+>/g, '').trim();
    if (!cleanText) return match;

    // Tạo slug an toàn cho id
    const slug = cleanText
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `muc-${counter}`;

    const id = `toc-${slug}-${counter}`;
    const level = tag.toLowerCase() === 'h2' ? 2 : 3;

    if (level === 2) {
      currentH2 = { id, text: cleanText, level: 2, subItems: [] };
      toc.push(currentH2);
    } else {
      if (currentH2) {
        currentH2.subItems = currentH2.subItems || [];
        currentH2.subItems.push({ id, text: cleanText, level: 3 });
      } else {
        toc.push({ id, text: cleanText, level: 3 });
      }
    }

    // Gán id và thuộc tính cuộn scroll-mt-24 để tránh bị header che khuất
    const cleanAttrs = attrs.replace(/\sid="[^"]*"/gi, '');
    return `<${tag} id="${id}" class="scroll-mt-24"${cleanAttrs}>${text}</${tag}>`;
  });

  return { toc, modifiedHtml };
}

