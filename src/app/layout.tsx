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
    default: 'Cognitaxes – Online Tax Filing, GST Services, Accounting & Compliance in India',
    template: '%s | Cognitaxes',
  },
  description:
    'Expert online tax filing, GST, bookkeeping, compliance management and business tax services for individuals and companies across India.',
  icons: { icon: '/images/logosvg.svg' },
  openGraph: {
    siteName: 'Cognitaxes',
    type: 'website',
    url: 'https://cognitaxes.com/',
    title:
      'Cognitaxes – Online Tax Filing, GST Services, Accounting & Compliance in India',
    description:
      'Expert online tax filing, GST, bookkeeping, compliance management and business tax services for individuals and companies across India.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cognitaxes – Online Tax Filing, GST Services, Accounting & Compliance in India',
    description:
      'Expert online tax filing, GST, bookkeeping, compliance management and business tax services for individuals and companies across India.',
    images: ['https://cognitaxes.com/images/logosvg.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Cognitaxes',
    url: 'https://cognitaxes.com',
    logo: 'https://cognitaxes.com/images/logosvg.svg',
  };
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Header />
        <main className="pt-20 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
