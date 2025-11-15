'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface Props extends ImageProps {
  fallback?: string;
}

export default function OptimizedImage({
  src,
  fallback = '/images/fallback-image.png', // your fallback image
  alt,
  ...props
}: Props) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
    />
  );
}
