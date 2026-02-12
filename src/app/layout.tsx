import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HIE Lab | UC Irvine - High-speed Integrated Electronics",
  description:
    "High-speed Integrated Electronics Laboratory at UC Irvine — mm-wave and terahertz circuit design, AI-driven analog design, and emerging device technologies.",
  keywords: [
    "HIE Lab",
    "UC Irvine",
    "mm-wave",
    "terahertz",
    "integrated circuits",
    "RFIC",
    "analog design",
    "EECS",
  ],
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
        <Navbar />
        {children}
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
