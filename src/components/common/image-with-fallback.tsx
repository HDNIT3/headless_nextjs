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
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      {...rest}
      src={hasError || !imgSrc ? fallbackSrc : imgSrc}
      alt={alt || 'Hình ảnh'}
      className={className}
      onError={() => {
        setHasError(true);
      }}
      unoptimized={typeof imgSrc === 'string' && imgSrc.startsWith('http')}
    />
  );
}
