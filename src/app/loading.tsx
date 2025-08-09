import React from 'react';
// import LoadingModal from '@/icons/loadingModal';

export default function Loading() {
  return (
    <div className="loading-container fixed top-0 left-0 w-full h-full bg-mono-0 z-[999999]">
      <div className="loading-content w-full h-full flex flex-col items-center justify-center gap-4">
        {/* <LoadingModal /> */}
        <p className="body-small text-mono-100">
          {' '}
          Wird geladen..., bitte aktualisieren Sie diese Seite nicht.
        </p>
      </div>
    </div>
  );
}
