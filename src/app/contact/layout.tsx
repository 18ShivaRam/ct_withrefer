import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Cognitax — Schedule a Free Consultation',
  description:
    'Get in touch with Cognitax for expert tax help. Chat on WhatsApp, email us, or schedule a consultation to discuss your filing needs.',
  alternates: { canonical: 'https://cognitaxes.com/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}