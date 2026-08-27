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

export default function OptimizedImage({
  src,
  fallback = DEFAULT_FALLBACK,
  fallbacks = [],
  alt,
  ...props
}: Props) {
  const chain = useMemo(() => {
    const list: string[] = [];
    const primary = asUrl(src);
    if (primary) list.push(primary);
    for (const extra of fallbacks) {
      const url = String(extra || '').trim();
      if (url && !list.includes(url)) list.push(url);
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

  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      unoptimized={isRemote(current)}
      onError={() => {
        setIdx(i => (i < chain.length - 1 ? i + 1 : i));
      }}
    />
  );
}
