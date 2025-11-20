'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function HowItWorksPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const steps = [
    {
      id: 1,
      title: "Upload Documents",
      description: "Securely upload your tax documents through our client portal. Our system organizes your information for efficient processing.",
      icon: "/process-icon-1.svg",
      details: [
        "W-2s, 1099s, and other income statements",
        "Deduction documentation",
        "Previous year's tax returns",
        "Business financial statements (if applicable)",
        "Any tax-related correspondence"
      ]
    },
    {
      id: 2,
      title: "Expert Review",
      description: "Our tax professionals carefully review your documents, identify all possible deductions, and prepare your tax returns with precision.",
      icon: "/process-icon-2.svg",
      details: [
        "Thorough analysis by certified tax experts",
        "Identification of all eligible deductions and credits",
        "Optimization of your tax position",
        "Compliance with current tax laws",
        "Personalized recommendations"
      ]
    },
    {
      id: 3,
      title: "Secure Filing",
      description: "After your approval, we file your tax returns electronically with the appropriate tax authorities, ensuring security and compliance.",
      icon: "/process-icon-3.svg",
      details: [
        "Secure electronic filing",
        "Confirmation of acceptance",
        "Digital copies of all filed documents",
        "Refund tracking (if applicable)",
        "Year-round access to your tax documents"
      ]
    }
  ];

  const faqs = [
    {
      question: "How long does the tax preparation process take?",
      answer: "Most individual tax returns are completed within 1-2 weeks from the time we receive all necessary documents. Business returns may take 2-3 weeks depending on complexity."
    },
    {
      question: "Is my information secure?",
      answer: "Absolutely. We use bank-level encryption for all document uploads and storage. Our client portal is protected with multi-factor authentication, and we follow strict data privacy protocols."
    },
    {
      question: "What if I need to file an extension?",
      answer: "We can prepare and file extensions on your behalf. However, it's important to note that an extension gives you more time to file, not more time to pay any taxes owed."
    },
    {
      question: "Do you offer year-round tax support?",
      answer: "Yes, we provide tax support throughout the year, not just during tax season. Our clients can contact us anytime for tax-related questions or planning."
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h1>
            <p className="text-xl mb-8">
              Our streamlined process makes tax preparation simple, secure, and stress-free.
              Follow these easy steps to complete your tax filing with Cognitaxes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            {steps.map((step, index) => (
              <motion.div 
                key={step.id}
                variants={fadeIn}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center mb-20 last:mb-0`}
              >
                <div className="w-full md:w-1/2 mb-8 md:mb-0">
                  <div className="relative h-64 w-64 mx-auto">
                    <Image
                      src={step.icon}
                      alt={step.title}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </div>
                <div className="w-full md:w-1/2 md:px-8">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-xl mr-4">
                      {step.id}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-600 mr-2">✓</span>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Begin your hassle-free tax filing experience with Cognitaxes today.
              Our team is ready to guide you through every step of the process.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/contact" 
                className="px-8 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Contact Us
              </a>
              <a 
                href="/register" 
                className="px-8 py-3 bg-white text-blue-800 font-semibold rounded-lg border border-blue-800 hover:bg-blue-50 transition-colors duration-300"
              >
                Create an Account
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}