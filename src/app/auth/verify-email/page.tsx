'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaEnvelope } from 'react-icons/fa';

export default function VerifyEmailPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="bg-[#006666] px-6 py-8 text-white text-center">
            <h1 className="text-3xl font-bold">Verify Your Email</h1>
            <p className="mt-2">One last step to complete your registration</p>
          </div>

          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaEnvelope className="text-4xl text-[#006666]" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-8">
              We&apos;ve sent a verification link to your email address.
              Please click the link to verify your account and complete the registration process.
            </p>

            <div className="space-y-4">
              <p className="text-gray-600">
                Didn&apos;t receive the email? Check your spam folder or
              </p>
              <button 
                className="text-[#006666] hover:underline hover:text-[#087830] font-semibold"
                onClick={() => window.location.reload()}
              >
                Click here to resend verification email
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link 
                href="/auth/login"
                className="text-[#006666] hover:underline hover:text-[#087830] font-semibold"
              >
                Return to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}