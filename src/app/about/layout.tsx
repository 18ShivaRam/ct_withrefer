import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Cognitax — Mission, Values & Expert Team',
  description:
    'Learn about Cognitax: our mission to simplify tax filing, our values of accuracy and trust, and the expert team behind our services.',
  alternates: { canonical: 'https://cognitaxes.com/about' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}