import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Caveat,
  Satisfy,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-doodle",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const satisfy = Satisfy({
  variable: "--font-signature",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.faizbuildstuff.biz"),
  title: {
    default: "FaizuRrehman — Software Engineer & Product Builder",
    template: "%s · FaizuRrehman",
  },
  description:
    "17-year-old software engineer tinkering with full-stack web apps, AI workflows, and design engineering. Building redr.lol, BustTheFile, and high-craft web products.",
  keywords: [
    "FaizuRrehman",
    "FaizBuildsStuff",
    "cryptoxfz",
    "Full-Stack Engineer",
    "Design Engineer",
    "Next.js Developer",
    "redr.lol",
    "BustTheFile",
  ],
  authors: [{ name: "FaizuRrehman", url: "https://x.com/FaizBuildsStuff" }],
  creator: "FaizuRrehman (@FaizBuildsStuff)",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.faizbuildstuff.biz",
    siteName: "FaizuRrehman",
    title: "FaizuRrehman — Software Engineer & Product Builder",
    description:
      "Software engineer building fast full-stack web apps, AI workflows & SaaS products with high-craft design engineering.",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "FaizuRrehman — @FaizBuildsStuff & @cryptoxfz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FaizuRrehman — Software Engineer & Product Builder",
    description:
      "Software engineer building fast full-stack web apps, AI workflows & SaaS products with high-craft design engineering.",
    creator: "@FaizBuildsStuff",
    images: ["/og-banner.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/icon.svg",
    apple: [{ url: "/apple-touch-icon.png", sizes: "512x512", type: "image/png" }],
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
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${caveat.variable} ${satisfy.variable}`}
    >
      <body className="min-h-screen bg-[#FAFAF9] text-black antialiased selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}