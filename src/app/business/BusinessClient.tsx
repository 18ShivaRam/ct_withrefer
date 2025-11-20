'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaFileAlt, FaEdit, FaShieldAlt, FaChartLine, FaIdCard, FaGlobe, FaFileInvoice } from 'react-icons/fa';
import Image from 'next/image';

// Add static import so Next.js can optimize and provide blur placeholder
import businessImg from '../../../public/images/business.jpg';

export default function BusinessPage() {
  const [activeService, setActiveService] = useState("federal");
  const contentRef = useRef<HTMLDivElement>(null);

  const handleServiceClick = (serviceId: string) => {
    setActiveService(serviceId);
    // First scroll to navigation
    const navSection = document.querySelector('.sticky-nav');
    navSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Then after a delay, adjust scroll position to show the content
    setTimeout(() => {
      window.scrollTo({
        top: (contentRef.current?.offsetTop || 0) - 120, // Adjust this value based on your header height
        behavior: 'smooth'
      });
    }, 100);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  const services = [
    {
      id: "federal",
      icon: <FaFileAlt size={24} />,
      title: "U.S. Business Formation Services",
      shortDesc: "Expert preparation of your tax returns",
      mainDesc: "Starting a business in the United States? At Secure Tax Files, we make it simple. Whether you're a U.S. resident or a foreign entrepreneur, we help you choose the right structure, file the necessary documents, and launch your company with full legal and tax compliance.",

      federalServices: {
        title: "Entity Types We Form",
        items: [
          <> <b>LLC (Limited Liability Company)</b> – Flexible structure with pass-through taxation </>,
          <> <b>S-Corporation</b> – Ideal for small businesses with U.S. shareholders </>,
          <> <b>C-Corporation</b> – Best for start-ups seeking venture capital or international growth </>,
          <> <b>Partnerships & Sole Proprietorships</b> – For freelancers and small teams </>,
        ]
      },

      stateServices: {
        title: "What’s Included",
        items: [
          <> <b>Name Availability Check</b> – Ensure your business name is unique and compliant </>,
          <> <b>State Registration</b> – File Articles of Incorporation or Organization with the Secretary of State </>,
          <> <b>EIN Application</b> – Get your Employer Identification Number from the IRS </>,
          <> <b>Beneficial Ownership Reporting</b> – File with FinCEN under the Corporate Transparency Act </>,
          <> <b>U.S. Business Address & Mail Forwarding</b> – Optional service for non-residents </>,
        ]
      },

      localServices: {
        title: "Non-U.S. Residents Welcome",
        items: [
          <> Form U.S. companies without a Social Security Number </>,
          <> Open U.S. bank accounts through partner platforms </>,
        ]
      },

      benefits: {
        title: "Why Choose Us?",
        items: [
          <> <b>End-to-End Support</b> – From formation to tax filings and compliance </>,
          <> <b>Transparent Pricing</b> – No hidden fees, clear deliverables </>,
          <> <b>Fast Turnaround</b> – Most formations completed within days </>,
          <> <b>Scalable Setup</b> – Ready for growth, funding, and multi-state operations </>,
        ]
      }
    }
    ,
    {
      id: "amendment",
      icon: <FaEdit size={24} />,
      title: "Limited Liability Company (LLC)",
      shortDesc: "Protect your personal assets and enjoy tax flexibility",
      mainDesc: "An LLC, or Limited Liability Company, is a flexible business structure that protects your personal assets from business debts and lawsuits while offering pass-through taxation—so profits are taxed only once on your personal income. It's easy to set up and manage, allowing owners to customize management and ownership arrangements.",

    },
    {
      id: "representation",
      icon: <FaShieldAlt size={24} />,
      title: "Partnerships",
      shortDesc: "Professional IRS issue resolution",
      mainDesc: "A Partnership is a business formed by two or more individuals who share ownership, responsibilities, profits, and liabilities. It’s ideal for teams that want to combine resources and expertise while maintaining flexibility. Partnerships can be structured as General Partnerships, where all partners manage and share liability, or Limited Partnerships, where some partners invest without being involved in day-to-day operations. Profits pass through to each partner’s personal tax return, making it a tax-efficient option for collaborative ventures.",

    },
    {
      id: "planning",
      icon: <FaChartLine size={24} />,
      title: "Corporation (C-Corp & S-Corp)",
      shortDesc: "Strategic tax planning services",
      mainDesc: "A Corporation is a legally separate entity from its owners, offering strong liability protection and the ability to raise capital through shares. It’s ideal for businesses planning to scale, attract investors, or operate internationally. Corporations follow formal governance rules, including a board of directors and officers, and are taxed separately from their owners—though S-Corps allow pass-through taxation for eligible small businesses. Whether forming a C-Corp or S-Corp, this structure provides credibility, growth potential, and long-term stability.",

    },
    {

      id: "itin",
      icon: <FaIdCard size={24} />,
      title: "Business Tax Preparation & Strategic Planning",
      shortDesc: "Individual Taxpayer ID Number services",
      mainDesc: (
        <>
          <b>For LLCs, Partnerships, S-Corps & C-Corps</b><br />
          At Secure Tax Files, we provide comprehensive tax preparation and forward-thinking planning for every type of business entity. Whether you're a solo founder, multi-member partnership, or scaling corporation, we tailor our services to match your structure, goals, and compliance needs.
        </>
      ),


      services: {
        title: " Tax Preparation Services",
        items: [
          "LLCs – Single-member and multi-member, including Schedule C or Form 1065",
          "Partnerships – Federal Form 1065 with K-1s for each partner",
          "S-Corporations – Federal Form 1120-S and state filings",
          "C-Corporations – Federal Form 1120 and applicable state returns",
          "Payroll & Employment Taxes – Forms 940, 941, 944, and state equivalents",
          "1099 Filings – For contractors, vendors, and freelancers"
        ]
      },
      process: {
        title: "Tax Planning Services",
        items: [
          "Minimize tax liability through entity-specific strategies",
          "Plan quarterly estimated taxes to avoid penalties",
          "Optimize owner compensation (salary vs. distributions)",
          "Structure equity and benefits for tax efficiency",
          "Navigate multi-state operations and nexus rules",
          "Evaluate S-Corp elections for LLCs and partnerships",
          "Plan for growth, funding, or exit strategies with tax impact in mind",
        ]
      },
      benefits: {
        title: "Why Businesses Trust Us",
        items: [
          <>
            <b>Entity-Specific Expertise</b> – We understand the nuances of each structure
          </>,
          <>
            <b>Multi-Jurisdiction Support</b> – Federal, state, and local compliance handled seamlessly
          </>,
          <>
            <b>Strategic Insight</b> – We help you plan ahead, not just react
          </>,
          <>
            <b>Audit-Ready Documentation</b> – Every return is prepared with precision and clarity
          </>,
        ]
      }

    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-24 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('/tax-pattern.svg')] opacity-10"></div>
        
        {/* Background image (optimized via next/image) */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={businessImg}
            alt="Business background"
            fill
            style={{ objectFit: 'cover' }}
            quality={60}
            sizes="100vw"
            placeholder="blur"
            loading="lazy"
          />
          {/* tint overlay to match previous opacity */}
          <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
        </div>
        
        <div className="absolute inset-0"></div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Text content */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8"
            >
              Business Tax Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl lg:text-xl mb-10 leading-relaxed"
            >
              Maximize your business potential with tax solutions designed for growth and compliance.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation - Added sticky-nav class */}
      <section className="sticky-nav bg-gray-50 py-8 sticky top-20 z-40 border-b shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className={`px-4 py-2  rounded-lg shadow hover:shadow-md transition-all text-sm font-medium 
                  ${activeService === service.id 
                    ? 'bg-[#006666] text-white ' 
                    : 'text-gray-700'}`}
              >
                {service.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Content Section */}
      <section ref={contentRef} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {services
            .filter(service => service.id === activeService)
            .map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-5xl mx-auto space-y-8"
              >
                {/* Main Description */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">{service.mainDesc}</p>
                </div>

                {service.id === "federal" ? (
                  <>
                    {/* Federal Services */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{service.federalServices?.title}</h3>
                      <ul className="space-y-3">
                        {service.federalServices?.items?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="text-blue-600">•</div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* State Services */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{service.stateServices?.title}</h3>
                      <ul className="space-y-3">
                        {service.stateServices?.items?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="text-blue-600">•</div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Local Services */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{service.localServices?.title}</h3>
                      <ul className="space-y-3">
                        {service.localServices?.items?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="text-blue-600">•</div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{service.benefits?.title}</h3>
                      <ul className="space-y-3">
                        {service.benefits?.items?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="text-blue-600">•</div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex justify-center gap-4">
                      <Link href="/contact" className="bg-[#006666] text-white px-6 py-3 rounded-lg hover:bg-[#087830] transition-all">
                        WhatsApp Free Consult
                      </Link>
                      <Link href="/contact" className="bg-[#006666] text-white px-6 py-3 rounded-lg hover:bg-[#087830] transition-all">
                        Email an Expert
                      </Link>
                    </div>
                  </>
                ) : service.id === "amendment" || service.id === "representation" || service.id === "planning" ? (
                  <>
                    {/* Services Section */}
                    {service.services?.items?.length? (
                      <div className="bg-white rounded-xl shadow-lg p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{service.services?.title}</h3>
                        <ul className="space-y-3">
                          {(service.benefits?.items || []).map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-gray-700">
                              <div className="text-blue-600">•</div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ):null}

                    {/* Process Section */}
                    {service.process?.items?.length ?(
                      <div className="bg-white rounded-xl shadow-lg p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{service.process?.title}</h3>
                        <ul className="space-y-3">
                          {(service.benefits?.items || []).map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-gray-700">
                              <div className="text-blue-600">•</div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ):null}

                    {/* Benefits Section */}
                    {service.benefits?.items?.length?  (
                      <div className="bg-white rounded-xl shadow-lg p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{service.benefits?.title}</h3>
                        <ul className="space-y-3">
                          {(service.benefits?.items || []).map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-gray-700">
                              <div className="text-blue-600">•</div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ):null}


                    {/* Quick Action Buttons */}
                    <div className="flex justify-center gap-4">
                       <Link href="/contact" className="bg-[#006666] text-white px-6 py-3 rounded-lg hover:bg-[#087830] transition-all">
                       WhatsApp Free Consult
                      </Link>
                        <Link href="/contact" className="bg-[#006666] text-white px-6 py-3 rounded-lg hover:bg-[#087830] transition-all">
                      Email an Expert
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Services Section */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{service.services?.title}</h3>
                      <ul className="space-y-3">
                        {service.services?.items?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="text-blue-600">•</div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Process Section */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{service.process?.title}</h3>
                      <ul className="space-y-3">
                        {service.process?.items?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="text-blue-600">•</div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits Section */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{service.benefits?.title}</h3>
                      <ul className="space-y-3">
                        {service.benefits?.items?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="text-blue-600">•</div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex justify-center gap-4">
                      <Link href="/contact" className="bg-[#006666] text-white px-6 py-3 rounded-lg hover:bg-[#087830] transition-all">
                        WhatsApp Free Consult
                      </Link>
                       <Link href="/contact" className="bg-[#006666] text-white px-6 py-3 rounded-lg hover:bg-[#087830] transition-all">
                       Email an Expert
                      </Link>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact us today for expert assistance with your individual tax needs
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
