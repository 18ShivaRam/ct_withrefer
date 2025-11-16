'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4 text-[#006666]">Cognitax</h3>
            <p className="mb-6 text-gray-300 leading-relaxed">
              Smart, Secure & Hassle-Free Tax Filing for individuals and businesses. Your trusted partner in financial success.
            </p>
            <div className="flex space-x-6 justify-center md:justify-start">
              <a 
                href="#" 
                className="text-gray-400 hover:text-[#006666] transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-[#006666] transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-[#006666] transition-all duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-6 text-[#006666]">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:pl-2 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:pl-2 inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/services" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:pl-2 inline-block"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/how-it-works" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:pl-2 inline-block"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:pl-2 inline-block"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/auth/login" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:pl-2 inline-block"
                >
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-6 text-[#006666]">Contact Us</h3>
            <div className="space-y-4">
              <a 
                href="mailto:info@cognitax.com" 
                className="flex items-center justify-center md:justify-start space-x-3 text-gray-300 hover:text-white transition-all duration-300 group"
              >
                <FaEnvelope className="text-[#006666] group-hover:scale-110 transition-transform duration-300" />
                <span>info@cognitax.com</span>
              </a>
              <a 
                href="tel:+1234567890" 
                className="flex items-center justify-center md:justify-start space-x-3 text-gray-300 hover:text-white transition-all duration-300 group"
              >
                <FaPhone className="text-[#006666] group-hover:scale-110 transition-transform duration-300" />
                <span>(123) 456-7890</span>
              </a>
              <div className="flex items-center justify-center md:justify-start space-x-3 text-gray-300 group">
                <FaMapMarkerAlt className="text-[#006666] group-hover:scale-110 transition-transform duration-300" />
                <span>123 Tax Street, Finance City, FC 12345</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Cognitax. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;