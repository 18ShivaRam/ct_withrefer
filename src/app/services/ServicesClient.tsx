'use client';

import { motion } from 'framer-motion';
import { FaUserTie, FaBuilding, FaCalculator, FaShieldAlt, FaSearchDollar } from 'react-icons/fa';
import Image from 'next/image';

export default function ServicesPage() {
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
        staggerChildren: 0.2
      }
    }
  };

  const services = [
    {
      id: 1,
      title: "Personal Tax Filing",
      description: "Our expert tax professionals handle your personal tax returns with precision and care. We ensure you receive all eligible deductions and credits while maintaining full compliance with tax laws.",
      icon: <FaUserTie className="text-4xl text-blue-800" />,
      features: [
        "Individual tax return preparation",
        "Tax planning and consultation",
        "Deduction optimization",
        "Electronic filing",
        "Year-round support"
      ]
    },
    {
      id: 2,
      title: "Business Tax Preparation",
      description: "We provide comprehensive tax services for businesses of all sizes, from startups to established corporations. Our team stays current with changing tax laws to maximize your business tax benefits.",
      icon: <FaBuilding className="text-4xl text-blue-800" />,
      features: [
        "Business tax return preparation",
        "Quarterly tax planning",
        "Entity selection consultation",
        "Tax credit identification",
        "Strategic tax planning"
      ]
    },
    {
      id: 3,
      title: "Bookkeeping & Payroll",
      description: "Maintain accurate financial records and ensure your employees are paid correctly and on time. Our bookkeeping and payroll services help you focus on running your business while we handle the numbers.",
      icon: <FaCalculator className="text-4xl text-blue-800" />,
      features: [
        "Monthly bookkeeping",
        "Payroll processing",
        "Financial statement preparation",
        "Account reconciliation",
        "Payroll tax filing"
      ]
    },
    {
      id: 4,
      title: "IRS Representation",
      description: "If you're facing an IRS audit or have tax issues, our experienced professionals will represent you. We communicate with the IRS on your behalf and work to resolve your tax matters efficiently.",
      icon: <FaShieldAlt className="text-4xl text-blue-800" />,
      features: [
        "Audit representation",
        "Tax notice assistance",
        "Penalty abatement",
        "Installment agreements",
        "Offer in compromise"
      ]
    },
    {
      id: 5,
      title: "Audit Support",
      description: "Our audit support services provide peace of mind during the audit process. We prepare all necessary documentation and guide you through each step to ensure the best possible outcome.",
      icon: <FaSearchDollar className="text-4xl text-blue-800" />,
      features: [
        "Audit preparation",
        "Documentation organization",
        "Representation during audit",
        "Post-audit analysis",
        "Compliance improvement"
      ]
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/tax-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8"
            >
              Our Tax & Financial Services
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl lg:text-2xl mb-10 leading-relaxed"
            >
              Comprehensive tax and financial solutions tailored to your unique needs.
              We combine expertise with personalized service to deliver exceptional results.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          >
            {services.map((service) => (
              <motion.div 
                key={service.id}
                variants={fadeIn}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="p-8">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 mx-auto mb-8"
                  >
                    {service.icon}
                  </motion.div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6">{service.title}</h3>
                  <p className="text-gray-600 mb-8 text-center text-lg leading-relaxed">{service.description}</p>
                  <ul className="space-y-4">
                    {service.features.map((feature, index) => (
                      <motion.li 
                        key={index} 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start group"
                      >
                        <span className="text-blue-600 mr-3 transform group-hover:scale-110 transition-transform">✓</span>
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8"
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-10 leading-relaxed"
            >
              Our team of tax experts is ready to help you navigate your financial journey.
              Schedule a consultation today to discuss your specific needs.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-6"
            >
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/contact" 
                className="px-10 py-4 bg-blue-800 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
              >
                Schedule a Consultation
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/how-it-works" 
                className="px-10 py-4 bg-white text-blue-800 font-semibold rounded-xl border-2 border-blue-800 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
              >
                Learn How It Works
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="max-w-5xl mx-auto"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16"
            >
              What Our Clients Say
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-2xl shadow-md">
                    JD
                  </div>
                  <div className="ml-6">
                    <h4 className="text-xl font-bold text-gray-900">John Doe</h4>
                    <p className="text-blue-600">Small Business Owner</p>
                  </div>
                </div>
                <p className="text-gray-600 italic text-lg leading-relaxed">
                  "Cognitaxes has been handling my business taxes for 3 years now. Their expertise has saved me thousands in deductions I didn't know I qualified for. Highly recommend their services!"
                </p>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-2xl shadow-md">
                    SM
                  </div>
                  <div className="ml-6">
                    <h4 className="text-xl font-bold text-gray-900">Sarah Miller</h4>
                    <p className="text-blue-600">Freelance Consultant</p>
                  </div>
                </div>
                <p className="text-gray-600 italic text-lg leading-relaxed">
                  "As a freelancer, my taxes were always complicated. The team at Cognitaxes simplified everything and made sure I was compliant while maximizing my returns. Worth every penny!"
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}