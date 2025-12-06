'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Add static import (replace filename if different)
import refundImg from '../../../public/images/refund.jpg';

export default function RefundPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-24 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('/tax-pattern.svg')] opacity-10"></div>

        {/* Optimized background via next/image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={refundImg}
            alt="Refund background"
            fill
            style={{ objectFit: 'cover' }}
            quality={60}
            sizes="100vw"
            placeholder="blur"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Text content centered on background */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8"
            >
              Tax Refund Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl lg:text-2xl mb-10 leading-relaxed"
            >
              Maximize your tax refund with our expert guidance
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                href="/contact"
                className="bg-white text-blue-900 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all inline-block font-semibold"
              >
                Get Your Refund Started
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Comment out previous image section */}
      {/*
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-[400px] rounded-xl overflow-hidden shadow-2xl hidden md:block"
        >
          <Image
            src="/images/refund.jpg"
            alt="Tax Refund Services"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
      </div>
      */}

      {/* Main Content Section - Remove previous image section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Content Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Overview */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Your Maximum Refund</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We specialize in identifying every possible deduction and credit you're entitled to. Our comprehensive review process ensures you receive the largest refund possible while staying compliant with tax laws.
                </p>
              </div>

              {/* Services */}
              {/* <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Know Your Refund Status?</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="text-blue-600 mt-1">•</div>
                      <div>
                        <span className="font-semibold">Comprehensive Tax Review</span>
                        <p className="text-gray-600">Thorough analysis of your tax situation to identify all refund opportunities</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="text-blue-600 mt-1">•</div>
                      <div>
                        <span className="font-semibold">Deduction Maximization</span>
                        <p className="text-gray-600">Expert identification of all eligible deductions and credits</p>
                      </div>
                    </li>
                  </ul>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="text-blue-600 mt-1">•</div>
                      <div>
                        <span className="font-semibold">Refund Tracking</span>
                        <p className="text-gray-600">Monitor your refund status and estimated arrival time</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="text-blue-600 mt-1">•</div>
                      <div>
                        <span className="font-semibold">Direct Deposit Setup</span>
                        <p className="text-gray-600">Fast and secure refund delivery to your bank account</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div> */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
    Know Your Refund Status
  </h3>
  <div className="divide-y">
    <div className="flex justify-between items-center py-4">
      <span className="text-gray-600 font-medium">State Refund Status</span>
      <a href="https://support.taxslayerpro.com/hc/en-us/articles/360022323154-State-Tax-Information-For-All-States" target="_blank" className="text-[#006666] hover:underline font-medium">
        Check Here
      </a>
    </div>

    <div className="flex justify-between items-center py-4">
      <span className="text-gray-600 font-medium">Federal Refund Status</span>
      <a href="https://sa.www4.irs.gov/wmr/" target="_blank" className="text-[#006666] hover:underline font-medium">
        Check Here
      </a>
    </div>

    {/* <div className="flex justify-between items-center py-4">
      <span className="text-gray-600 font-medium">Pay State Taxes Online</span>
      <a href="https://sa.www4.irs.gov/wmr/"    target="_blank" className="text-[#006666] hover:underline font-medium">
        Check Here
      </a>
    </div>

    <div className="flex justify-between items-center py-4">
      <span className="text-gray-600 font-medium">Pay Federal Taxes Online</span>
      <a href="https://sa.www4.irs.gov/wmr/"    target="_blank" className="text-[#006666] hover:underline font-medium">
        Check Here
      </a>
    </div> */}
  </div>
</div>


              {/* Call to Action */}
              <div className="flex justify-center gap-4">
                <Link
                  href="/contact"
                  className="bg-[#006666] font-medium text-white px-8 py-4 rounded-lg hover:bg-[#087830] transition-all inline-flex items-center gap-2"
                >
                  Get Your Refund Started
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Maximize Your Refund?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact us today for a free consultation and learn how much you could get back.
          </p>
          <Link
            href="/contact"
            className="bg-[#006666] text-white px-8 py-4 rounded-lg hover:bg-[#087830] transition-all inline-block"
          >
            Schedule a Consultation
          </Link>
        </div>
      </section>
    </main>
  );
}
