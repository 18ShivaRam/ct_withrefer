'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import WelcomeSection from '@/components/auth/WelcomeSection';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isRegisterPage = pathname === '/auth/register';

  return (
    <div className="min-h-screen flex">
      {/* Welcome Section */}
      <WelcomeSection />

      {/* Auth Forms Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ rotateY: isRegisterPage ? -90 : 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: isRegisterPage ? 90 : -90 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{ perspective: 1000 }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
