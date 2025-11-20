import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL('https://cognitaxes.com'),
  title: {
    default: 'Cognitax – Online Tax Filing, GST Services, Accounting & Compliance in India',
    template: '%s | Cognitax',
  },
  description:
    'Expert online tax filing, GST, bookkeeping, compliance management and business tax services for individuals and companies across India.',
  icons: { icon: '/images/logosvg.svg' },
  openGraph: {
    siteName: 'Cognitax',
    type: 'website',
    url: 'https://cognitaxes.com/',
    title:
      'Cognitax – Online Tax Filing, GST Services, Accounting & Compliance in India',
    description:
      'Expert online tax filing, GST, bookkeeping, compliance management and business tax services for individuals and companies across India.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="pt-20 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
