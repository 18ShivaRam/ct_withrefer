'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function WelcomeSection() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:flex lg:w-1/2 bg-[#006666] text-white p-6 flex-col justify-between relative overflow-hidden"
    >
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          Welcome to CogniTax
        </h1>
        <p className="text-lg mb-6 text-blue-50">
          Your trusted partner for seamless tax solutions and expert financial guidance.
        </p>

        {/* Added Metrics Section */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
          >
            <h3 className="text-3xl font-bold text-blue-100">15K+</h3>
            <p className="text-sm text-blue-200">Happy Clients</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center"
          >
            <h3 className="text-3xl font-bold text-blue-100">98%</h3>
            <p className="text-sm text-blue-200">Success Rate</p>
          </motion.div>
        </div>

        <div className="space-y-3">
          <Feature
            title="Expert Tax Professionals"
            description="Certified experts with years of experience"
            icon="checkmark"
          />
          <Feature
            title="Secure & Confidential"
            description="Bank-level security for your data"
            icon="shield"
          />
          <Feature
            title="Maximum Returns"
            description="Optimize your tax savings"
            icon="checkmark"
          />
          <Feature
            title="24/7 Support Available"
            description="Round-the-clock assistance"
            icon="phone"
          />
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 bg-[#006666] z-0"></div>
      <div className="absolute inset-0 opacity-10 z-0 pattern-dots"></div>
      <Image
        src="/images/tax-team.svg"
        alt="Tax Professional Team"
        fill
        className="object-contain object-center opacity-30 mix-blend-overlay"
        priority
      />
    </motion.div>
  );
}

function Feature({ title, description, icon }: { title: string; description: string; icon: string }) {
  const icons = {
    checkmark: <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />,
    shield: <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />,
    money: <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />,
    phone: <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="flex items-center bg-white/10 p-3 rounded-lg backdrop-blur-sm transition-all">
      <div className="bg-[#087830] p-2 rounded-full mr-3">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          {icons[icon as keyof typeof icons]}
        </svg>
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-blue-100">{description}</p>
      </div>
    </motion.div>
  );
}
