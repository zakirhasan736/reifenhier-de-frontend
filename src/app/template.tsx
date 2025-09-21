import React from 'react';
import Header from '@/components/shared/header/Header';
import Footer from '@/components/shared/footer/Footer';
import { Toaster } from 'react-hot-toast';


export default function Template({ children }: { children: React.ReactNode }) {

  return (
    <>
      <Header />
      <main className="page-main-content-wrapper">
        <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
        {children}
      </main>
      <Footer />
    </>
  );
}
