'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
// import Image from 'next/image';

function NotFoundContent() {
  const searchParams = useSearchParams();
  const ref = searchParams?.get('ref'); // optional query param for context
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      {/* <Image
        src="/images/404.svg"
        alt="404 Not Found"
        width={280}
        height={280}
        className="mb-6"
      /> */}
      <h1 className="text-4xl font-bold text-primary mb-3">
        Seite nicht gefunden
      </h1>
      <p className="text-gray-600 max-w-md mb-6">
        Die von Ihnen angeforderte Seite konnte nicht gefunden werden.
        {ref && (
          <span className="block text-sm text-gray-400 mt-2">
            Referenz: {ref}
          </span>
        )}
      </p>
      <Link
        href="/"
        className="bg-primary text-white px-6 py-3 rounded-full text-sm hover:bg-primary-dark transition-colors"
      >
        Zur Startseite
      </Link>
    </div>
  );
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Lädt...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
