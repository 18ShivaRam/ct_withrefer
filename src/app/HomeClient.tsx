'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import PromoModal from '@/components/layout/PromoModal';
import TestimonialSlider from '@/components/home/TestimonialSlider';

// dynamic-load icons to reduce bundle size
const FaShieldAlt = dynamic(() => import('react-icons/fa').then(mod => mod.FaShieldAlt), { ssr: false });
const FaChartLine = dynamic(() => import('react-icons/fa').then(mod => mod.FaChartLine), { ssr: false });
const FaFileInvoiceDollar = dynamic(() => import('react-icons/fa').then(mod => mod.FaFileInvoiceDollar), { ssr: false });
const FaUserTie = dynamic(() => import('react-icons/fa').then(mod => mod.FaUserTie), { ssr: false });
const FaRegClock = dynamic(() => import('react-icons/fa').then(mod => mod.FaRegClock), { ssr: false });
const FaCalculator = dynamic(() => import('react-icons/fa').then(mod => mod.FaCalculator), { ssr: false });
const FaHandsHelping = dynamic(() => import('react-icons/fa').then(mod => mod.FaHandsHelping), { ssr: false });
const FaChevronLeft = dynamic(() => import('react-icons/fa').then(mod => mod.FaChevronLeft), { ssr: false });
const FaChevronRight = dynamic(() => import('react-icons/fa').then(mod => mod.FaChevronRight), { ssr: false });

// Replace string paths with static imports so Next.js can optimize and provide blur placeholders
import app1 from '../../public/images/app1.jpg';
import app2 from '../../public/images/app2.jpg';
import app3 from '../../public/images/app3.jpg';

const images = [app1, app2, app3];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    // increased interval to reduce frequent network activity and visual churn
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // 3 second interval

    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Landing Promo Modal */}
      <PromoModal />
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden min-h-screen">
        {/* Background Carousel */}
        {/* Render only the currently visible image to avoid loading all carousel images at once */}
        <motion.div
          key={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={images[currentImage]}
            alt={`Background ${currentImage + 1}`}
            fill
            style={{ objectFit: 'cover' }}
            quality={60}          // reduced quality
            sizes="100vw"
            placeholder="blur"
            loading="lazy"        // lazy-load hero to reduce prefetch pressure
          />
        </motion.div>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        {/* Content */}
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left content */}
          

        
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="md:w-1/2 flex flex-col justify-center text-left"
    >
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
        Smart, Secure & Hassle-Free Tax Filing
      </h1>
      <p className="text-lg sm:text-xxl mb-8 text-blue-100">
        Cognitaxes provides expert tax preparation and financial advisory services for individuals and businesses.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/contact" 
          prefetch={false}
          className="bg-[#006666] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#087830] transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
        >
          Start Your Tax Filing
        </Link>
        <Link 
          href="/contact" 
          prefetch={false}
          className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:text-[#006666] hover:bg-white transition-all duration-300 text-center"
        >
          Schedule a Consultation
        </Link>
      </div>
    </motion.div>


          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="absolute inset-0 pointer-events-none bg-[url('/pattern-dots.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Why Choose <span className="text-[#006666]">Cognitaxes</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine expertise, technology, and personalized service to make tax filing simple and stress-free.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: <FaShieldAlt size={48} />,
                title: "Secure & Confidential",
                desc: "Your financial data is protected with bank-level security and strict confidentiality protocols.",
                color: "bg-blue-100 text-blue-600"
              },
              {
                icon: <FaUserTie size={48} />,
                title: "Expert Tax Professionals",
                desc: "Our certified experts stay updated with the latest tax laws to maximize your benefits.",
                color: "bg-green-100 text-green-600"
              },
              {
                icon: <FaRegClock size={48} />,
                title: "Time-Saving Solutions",
                desc: "Streamlined processes save time while ensuring maximum deductions and credits.",
                color: "bg-yellow-100 text-yellow-600"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center text-center"
              >
                <div className={`${item.color} p-6 rounded-full mb-5 flex items-center justify-center`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white relative">
        <div className="absolute inset-0 pointer-events-none bg-[url('/pattern-circles.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Our <span className="text-[#006666]">Services</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Comprehensive tax and financial services tailored to your specific needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 mb-12">
            {[
              {
                title: "Personal Tax Filing",
                desc: "Expert preparation of individual tax returns with maximum deductions and credits.",
                icon: <FaFileInvoiceDollar size={40} />,
                color: "bg-blue-100 text-blue-600"
              },
              {
                title: "Business Tax Preparation",
                desc: "Comprehensive tax services for small businesses, partnerships, and corporations.",
                icon: <FaCalculator size={40} />,
                color: "bg-green-100 text-green-600"
              },
              {
                title: "Bookkeeping & Payroll",
                desc: "Accurate financial record-keeping and efficient payroll management services.",
                icon: <FaHandsHelping size={40} />,
                color: "bg-yellow-100 text-yellow-600"
              },
              {
                title: "IRS Representation",
                desc: "Professional representation in IRS audits, appeals, and tax resolution cases.",
                icon: <FaUserTie size={40} />,
                color: "bg-red-100 text-red-600"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 flex gap-6 items-start group"
              >
                <div className={`${service.color} p-6 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-2xl sm:text-2.5xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{service.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          
          <motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  className="w-full"
>
  {/* <div className="flex justify-between items-center w-full">
    <div className="flex justify-start w-1/2 pr-2 items-center">
      <Link
        href="/individual"
        prefetch={false}
        className="bg-[#006666] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#087830] transition-all duration-300 inline-block transform hover:scale-105 hover:shadow-lg"
      >
        View Individual Services
      </Link>
    </div>

    <div className="flex justify-end w-1/2 pl-2">
      <Link
        href="/business"
        prefetch={false}
        className="bg-[#006666] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#087830] transition-all duration-300 inline-block transform hover:scale-105 hover:shadow-lg"
      >
        View Business Services
      </Link>
    </div>
  </div> */}
  <div className="flex w-full">
  {/* Left half */}
  <div className="flex justify-center items-center w-1/2 pr-2">
    <Link
      href="/individual"
      prefetch={false}
      className="bg-[#006666] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#087830] transition-all duration-300 inline-block transform hover:scale-105 hover:shadow-lg"
    >
      View Individual Services
    </Link>
  </div>

  {/* Right half */}
  <div className="flex justify-center items-center w-1/2 pl-2">
    <Link
      href="/business"
      prefetch={false}
      className="bg-[#006666] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#087830] transition-all duration-300 inline-block transform hover:scale-105 hover:shadow-lg"
    >
      View Business Services
    </Link>
  </div>
</div>
 
</motion.div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 relative">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Client <span className="text-[#006666]">Testimonials</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our clients have to say about their experience with Cognitaxes.
            </p>
          </motion.div>
          
          <TestimonialSlider />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-100 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Schedule a free consultation with our tax experts and discover how we can help you maximize your tax benefits.
          </p>
          {/* <Link 
            href="/contact" 
            prefetch={false}
            className="bg-[#006666] text-white px-10 py-4 rounded-lg font-semibold hover:bg-[#087830] transition-all duration-300 inline-block transform hover:scale-105 hover:shadow-lg"
          >
            Contact Us Today
          </Link> */}
          <a href="https://wa.me/+918977222353" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[#006666] text-white px-10 py-4 rounded-lg font-semibold hover:bg-[#087830] transition-all duration-300 inline-block transform hover:scale-105 hover:shadow-lg">
            Contact Us Today
            </a>

        </motion.div>
      </section>
    </>
  );
}
