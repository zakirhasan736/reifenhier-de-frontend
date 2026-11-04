import React from 'react';

import { Toaster } from 'react-hot-toast';
export default function Template({ children }: { children: React.ReactNode }) {

  return (
    <>
      <main className="page-main-content-wrapper">
        <Toaster
          position="bottom-right"
          toastOptions={{ duration: 3000 }}
          // stay above the product page's sticky price bar and the compare tray
          containerStyle={{ bottom: 'calc(16px + var(--pdp-sticky-h, 0px) + var(--compare-tray-h, 0px))' }}
        />
        {children}
      </main>
    </>
  );
}
