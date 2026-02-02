import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
