'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  fallbackSrc = '/images/contact_email.png',
  alt,
  className,
  ...rest
}: ImageWithFallbackProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const resolvedSrc = !src || src === failedSrc ? fallbackSrc : src;

  return (
    <Image
      {...rest}
      src={resolvedSrc}
      alt={alt || 'Hình ảnh'}
      className={className}
      onError={() => {
        setFailedSrc(src ?? null);
      }}
      unoptimized={resolvedSrc.startsWith('http')}
    />
  );
}
