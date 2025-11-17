'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Always show on landing to home page
    setIsOpen(true);
  }, []);

  const close = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black"
        onClick={close}
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white rounded-2xl shadow-xl w-[92%] sm:w-[560px] p-6 sm:p-8"
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <Image
            src="/images/logosvg1.jpg"
            alt="Cognitax Logo"
            width={160}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>

        {/* Heading and copy */}
        <h3 className="text-center text-xl sm:text-2xl font-bold text-gray-900">
          Start your preparation for free,
          <br />
          Pay only when you file.
        </h3>
        <p className="mt-3 text-center text-sm text-gray-600">
          Get expert tax filing services with Cognitax. Begin today at no
          cost—pay only when you approve your return for filing.
        </p>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/auth/login"
            className="px-5 py-2.5 rounded-md bg-[#006666] text-white font-medium hover:bg-[#087830] transition-colors"
            onClick={close}
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="px-5 py-2.5 rounded-md border border-[#006666] text-[#006666] font-medium hover:bg-[#f0fdfa] transition-colors"
            onClick={close}
          >
            Register
          </Link>
        </div>
      </motion.div>
    </div>
  );
}