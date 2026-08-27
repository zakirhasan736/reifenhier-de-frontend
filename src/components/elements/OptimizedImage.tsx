'use client';

import Image, { ImageProps } from 'next/image';
import { useEffect, useMemo, useState } from 'react';

const DEFAULT_FALLBACK = '/images/realistic-complete-set-car-wheels-2.png';

interface Props extends ImageProps {
  fallback?: string;
  fallbacks?: string[];
}

function asUrl(value: ImageProps['src']): string {
  return typeof value === 'string' ? value.trim() : '';
}

function isRemote(url: string) {
  return /^https?:\/\//i.test(url);
}

function skipOptimizer(url: string) {
  return isRemote(url) || url.includes('/images/product-image/');
}

export default function OptimizedImage({
  src,
  fallback = DEFAULT_FALLBACK,
  fallbacks = [],
  alt,
  className,
  width,
  height,
  fill,
  priority,
  fetchPriority,
  sizes,
  ...props
}: Props) {
  const chain = useMemo(() => {
    const list: string[] = [];
    const primary = asUrl(src);
    if (primary && primary !== DEFAULT_FALLBACK) list.push(primary);
    for (const extra of fallbacks) {
      const url = String(extra || '').trim();
      if (url && url !== DEFAULT_FALLBACK && !list.includes(url)) list.push(url);
    }
    if (fallback && !list.includes(fallback)) list.push(fallback);
    if (list.length === 0) list.push(DEFAULT_FALLBACK);
    return list;
  }, [src, fallback, fallbacks]);

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [chain.join('|')]);

  const current = chain[Math.min(idx, chain.length - 1)];
  const goNext = () => setIdx(i => (i < chain.length - 1 ? i + 1 : i));

  if (skipOptimizer(current) && !fill) {
    return (
      // Native img avoids Next optimizer 400s on merchant/AWIN hosts
      // and keeps the uploaded/AWIN URL in the listing HTML.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={current}
        alt={alt}
        className={className}
        width={typeof width === 'number' ? width : undefined}
        height={typeof height === 'number' ? height : undefined}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={fetchPriority || (priority ? 'high' : 'auto')}
        referrerPolicy="no-referrer"
        decoding="async"
        onError={goNext}
      />
    );
  }

  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      className={className}
      width={width}
      height={height}
      fill={fill}
      sizes={sizes}
      priority={priority}
      fetchPriority={fetchPriority}
      unoptimized={skipOptimizer(current)}
      referrerPolicy="no-referrer"
      onError={goNext}
    />
  );
}
