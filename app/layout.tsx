import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import SmoothScroll from "@/components/smooth-scroll";
import IntroScreen from "@/components/intro-screen";
import AestheticTabTitle from "@/components/aesthetic-tab-title";
import PageTransition from "@/components/page-transition";

// Keep Geist Mono for your tech/code snippets (like your // 01 markers)
const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "cryptovoid.ex",
    template: "%s — cryptovoid",
  },
  description: "sixteen-year-old developer turning seventeen on 22 dec 2026",
  applicationName: "cryptovoid",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
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
        <SmoothScroll>
          <AestheticTabTitle />
          <IntroScreen />
          <Header />
          <PageTransition>
            <main className="flex-grow">
              {children}
            </main>
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}