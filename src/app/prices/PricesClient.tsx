'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface PriceItem {
  id: string;
  title: string;
  price: number;
  whatsapp_number: string;
  email: string;
}

// dynamic icons
const FaWhatsapp = dynamic(() => import('react-icons/fa').then(mod => mod.FaWhatsapp), { ssr: false });
const FaEnvelope = dynamic(() => import('react-icons/fa').then(mod => mod.FaEnvelope), { ssr: false });

import pricesImg from '../../../public/images/prices.jpg';

export default function PricesPage() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('prices')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPrices(data || []);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (number: string, service: string) => {
    const message = encodeURIComponent(`Hi, I'm interested in your service: ${service}`);
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
  };

  const handleEmail = (email: string, service: string) => {
    const subject = encodeURIComponent(`Inquiry about ${service}`);
    const body = encodeURIComponent(`Hi, I'm interested in your service: ${service}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

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
            src={pricesImg}
            alt="Prices background"
            fill
            style={{ objectFit: 'cover' }}
            quality={60}
            sizes="100vw"
            placeholder="blur"
            loading="lazy"
          />
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
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8"
            >
              Transparent Pricing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl lg:text-2xl mb-10 leading-relaxed"
            >
              Clear, upfront pricing for all your tax and business needs
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                href="/contact"
                prefetch={false}
                className="bg-white text-[#006666] px-8 py-4 rounded-lg hover:bg-blue-50 transition-all inline-block font-semibold"
              >
                Get Started Today
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing List */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="divide-y divide-gray-200">
                  {prices.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-6 hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                      {/* <span className="text-xl font-bold text-[#006666]">
                        {item.price?.toString().toLowerCase() === "free"
                        ? "Free": isNaN(Number(item.price))? "0.00": Number(item.price).toFixed(2)}
                        </span> */}

                        <span className="text-xl font-bold text-[#006666]">
                          {item.price}
                          </span>


                        <div className="flex gap-2">
                          <button
                            onClick={() => handleWhatsApp(item.whatsapp_number, item.title)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                          >
                            <FaWhatsapp size={24} />
                          </button>
                          <button
                            onClick={() => handleEmail(item.email, item.title)}
                            className="p-2 text-[#006666] hover:bg-green-100 rounded-full transition-colors"
                          >
                            <FaEnvelope size={24} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact us today for a personalized quote and consultation.
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
