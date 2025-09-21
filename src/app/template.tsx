import React from 'react';

import { Toaster } from 'react-hot-toast';


export default function Template({ children }: { children: React.ReactNode }) {

  return (
    <>
      <main className="page-main-content-wrapper">
        <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
        {children}
      </main>
    </>
  );
}
