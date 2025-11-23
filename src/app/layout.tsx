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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  openGraph: {
    type: 'website',
    siteName: 'Cognitaxes',
    url: 'https://cognitaxes.com/',
    title: 'Cognitaxes — Smart tax filing for individuals & businesses',
    description:
      'Easy online tax filing with transparent pricing and dedicated human support.',
    images: [
      {
        url: 'https://cognitaxes.com/images/logosvg1.jpg',
        width: 1200,
        height: 630,
        alt: 'Cognitaxes brand logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cognitaxes – Online Tax Filing, GST Services, Accounting & Compliance in India',
    description:
      'Expert online tax filing, GST, bookkeeping, compliance management and business tax services for individuals and companies across India.',
    images: ['https://cognitaxes.com/images/logosvg1.jpg'],
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
    legalName: 'Cognitaxes',
    alternateName: 'Cognitax LLC',
    url: 'https://cognitaxes.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://cognitaxes.com/images/logosvg1.jpg'
    },
    sameAs: [
      'https://www.facebook.com/profile.php?id=61583894408545',
      'https://www.linkedin.com/in/cognitaxes/',
      'https://www.instagram.com/cognitaxes/',
    ],
  };
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Cognitaxes',
    url: 'https://cognitaxes.com/',
    image: 'https://cognitaxes.com/images/logosvg1.jpg',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.google.com/search?q=site:cognitaxes.com+{search_term_string}',
      'query-input': 'required name=search_term_string',
    },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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
