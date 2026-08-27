'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function BlogCoverImage({
  src,
  alt,
  className,
  width = 1024,
  height = 200,
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const imageSrc = src && src !== '' ? src : '';

  if (failed || !imageSrc) {
    return (
      <div
        className={`bg-[#F0F0F2] ${className || ''}`}
        aria-hidden
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      onError={() => setFailed(true)}
    />
  );
}
