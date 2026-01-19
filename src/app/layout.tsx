import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SmartPharmacy — Sistem Apotek Terintegrasi",
    template: "%s | SmartPharmacy",
  },
  description:
    "Sistem Manajemen Apotek Terintegrasi berbasis Service-Oriented Architecture (SOA). Dikembangkan dengan Next.js untuk efisiensi operasional apoteker dan pelayanan pasien.",
  keywords: [
    "SmartPharmacy",
    "SOA Next.js",
    "Service-Oriented Architecture",
    "Sistem Apotek Digital",
    "Pharmacy Management System",
  ],
  authors: [{ name: "KyuzenDev" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
