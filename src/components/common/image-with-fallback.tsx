'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { formatMediaUrl } from '@/lib/utils/media';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  fallbackSrc = '/images/contact_email.png',
  alt,
  className,
  unoptimized = true,
  ...rest
}: ImageWithFallbackProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  // Chuẩn hóa URL backend thành Frontend URI (/san-pham/wp-upload/...)
  const formattedSrc = formatMediaUrl(src);
  const resolvedSrc = !formattedSrc || formattedSrc === failedSrc ? fallbackSrc : formattedSrc;

  return (
    <Image
      {...rest}
      src={resolvedSrc}
      alt={alt || 'Hình ảnh'}
      className={className}
      onError={() => {
        setFailedSrc(src ?? null);
      }}
      unoptimized={unoptimized}
    />
  );
}
