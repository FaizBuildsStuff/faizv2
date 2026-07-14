'use client'

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import React from 'react';

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen w-full">
      

      {/* DYNAMIC COMPONENT INNER CONTENT INJECTION */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* PERSISTENT HIGH-END ANALYTICS FOOTER */}
      <Footer />
      
    </div>
  );
}