'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import contactImg from '../../../public/images/contact.jpg';

// dynamic-load icons used in info block to reduce bundle
const DynMap = dynamic(() => import('react-icons/fa').then(m => m.FaMapMarkerAlt), { ssr: false });
const DynPhone = dynamic(() => import('react-icons/fa').then(m => m.FaPhone), { ssr: false });

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Send data to Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: formData.firstName + ' ' + formData.lastName,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      setSubmitSuccess(true);
      // Clear form fields but keep the form visible
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);

    } catch (error) {
      setSubmitError('There was an error submitting your message. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = {
    address: "633 old stone rd, Austin, Tx, 78737",
    phone: "+1 (832)-334-4840",
    email: "support@cognitax.com"
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
            src={contactImg}
            alt="Contact background"
            fill
            style={{ objectFit: 'cover' }}
            quality={60}
            sizes="100vw"
            placeholder="blur"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
        </div>

        <div className="absolute inset-0 "></div>

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
              Contact Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl lg:text-2xl mb-10 leading-relaxed"
            >
              Have questions about our services? Need tax advice?
              <br className="hidden sm:block" />
              Our team is here to help you with all your tax and financial needs.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
              <p className="text-gray-600 mt-2">
                Contact our support team or make appointment with our consultants.
              </p>
            </div> */}

            <div className="bg-gray-50 rounded-xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Form Section */}

                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Request a Consultation</h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Your Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white rounded-md border border-gray-300 text-gray-900 text-base placeholder:text-gray-500"
                        required
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white rounded-md border border-gray-300 text-gray-900 text-base placeholder:text-gray-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white rounded-md border border-gray-300 text-gray-900 text-base placeholder:text-gray-500"
                        required
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Your Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white rounded-md border border-gray-300 text-gray-900 text-base placeholder:text-gray-500"
                      />
                    </div>

                    <textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-white rounded-md border border-gray-300 text-gray-900 text-base placeholder:text-gray-500"
                      required
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#006666] text-white  py-3 rounded-md hover:bg-[#087830] transition-colors"
                    >
                      {isSubmitting ? "Sending..." : "Submit"}
                    </button>

                    {submitSuccess && (
                      <div className="text-green-600 text-center">Message sent successfully!</div>
                    )}
                    {submitError && (
                      <div className="text-red-600 text-center">{submitError}</div>
                    )}
                  </form>
                </div>

                {/* Contact Info Section */}
                <div className="flex flex-col justify-center">
                  <div className="space-y-6">

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <FaMapMarkerAlt className="text-2xl text-[#006666]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Address</h3>
                        <p className="text-gray-700 text-base leading-relaxed">
                          {contactInfo.address}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <FaMapMarkerAlt className="text-2xl text-[#006666]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                        <p className="text-gray-700 text-base leading-relaxed">
                          {contactInfo.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <FaPhone className="text-2xl text-[#006666]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Numbers</h3>
                        <a href={`tel:${contactInfo.phone}`} className="text-gray-700 text-base hover:text-blue-600">
                          {contactInfo.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-16 bg-green-100">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl p-8 md:p-12 shadow-md">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-600 mb-8">
                Contact us today to schedule a consultation or ask any questions you may have.
              </p>

              <a
                href="mailto:info@cognitax.com"
                className="inline-block bg-[#00B2FF] text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section> */}
      {/* CTA Section */}
      <section className="py-16 bg-green-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact us today to schedule a consultation or ask any questions you may have.
          </p>
        
          <Link
            href="/contact"
            prefetch={false}
            className=" bg-[#006666] text-white py-4 px-8 rounded-lg hover:bg-[#087830] transition-all inline-block"
          >
            Email Us 
          </Link>
        </div>
      </section>
    </main>
  );
}
