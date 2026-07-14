import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

// Keep Geist Mono for your tech/code snippets (like your // 01 markers)
const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "portfolio",
  description: "selected web productions and experiments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        {/* Load Satoshi font directly from a fast, reliable premium CDN */}
        <link 
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" 
          rel="stylesheet" 
        />
        <style>{`
          /* Force it as the default system font override across the entire app */
          html, body {
            font-family: 'Satoshi', sans-serif !important;
          }
        `}</style>
      </head>
      <body className="min-h-full bg-[#09090b] text-[#f4f4f5] flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}