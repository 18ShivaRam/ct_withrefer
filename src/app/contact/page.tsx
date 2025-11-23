import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Cognitaxes — Schedule a Free Consultation',
  description:
    'Get in touch with Cognitaxes for expert tax help. Chat on WhatsApp, email us, or schedule a consultation to discuss your filing needs.',
  alternates: { canonical: 'https://cognitaxes.com/contact' },
  openGraph: {
    type: 'website',
    url: 'https://cognitaxes.com/contact',
    siteName: 'Cognitaxes',
    title: 'Contact Cognitaxes — Schedule a Free Consultation',
    description:
      'Get in touch with Cognitaxes for expert tax help. Chat on WhatsApp, email us, or schedule a consultation to discuss your filing needs.',
    images: [
      {
        url: 'https://cognitaxes.com/images/contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Cognitaxes',
      },
    ],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}