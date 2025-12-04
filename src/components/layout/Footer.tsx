'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube,FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4 text-[#006666]">Cognitaxes</h3>
            <p className="mb-6 text-gray-300 leading-relaxed">
              Smart, Secure & Hassle-Free Tax Filing for individuals and businesses. Your trusted partner in financial success.
            </p>
            <div className="flex space-x-6 justify-center md:justify-start">
              <a 
                href="https://www.facebook.com/profile.php?id=61583894408545" 
                className="text-gray-400 hover:text-[#006666] transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a 
                href="https://x.com/cognitaxes" 
                className="text-gray-400 hover:text-[#006666] transition-all duration-300 transform hover:scale-110"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a 
                href="https://www.linkedin.com/in/cognitaxes/" 
                className="text-gray-400 hover:text-[#006666] transition-all duration-300 transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={24} />
              </a>

               <a 
                href="https://www.youtube.com/channel/UC-axDIRGdKtoA5OHyy1RlKw" 
                className="text-gray-400 hover:text-[#006666] transition-all duration-300 transform hover:scale-110"
                aria-label="Youtube"
              >     <FaYoutube size={24} />
              </a>

              <a 
                href="https://www.instagram.com/cognitaxes/" 
                className="text-gray-400 hover:text-[#006666] transition-all duration-300 transform hover:scale-110"
                aria-label="Youtube"
              >     <FaInstagram  size={24} />
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
                  href="/individual" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:pl-2 inline-block"
                >
                  Individual
                </Link>
              </li>
              <li>
                <Link 
                  href="/business" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:pl-2 inline-block"
                >
                  Business
                </Link>
              </li>
              <li>
                <Link 
                  href="/refund" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:pl-2 inline-block"
                >
                  Refund
                </Link>
              </li>
              <li>
                <Link 
                  href="/prices" 
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:pl-2 inline-block"
                >
                  Prices
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
                href="mailto:admin@cognitaxes.com" 
                className="flex items-center justify-center md:justify-start space-x-3 text-gray-300 hover:text-white transition-all duration-300 group"
              >
                <FaEnvelope className="text-[#006666] group-hover:scale-110 transition-transform duration-300" />
                <span>admin@cognitaxes.com</span>
              </a>
              <a 
                href="tel:+1234567890" 
                className="flex items-center justify-center md:justify-start space-x-3 text-gray-300 hover:text-white transition-all duration-300 group"
              >
                <FaPhone className="text-[#006666] group-hover:scale-110 transition-transform duration-300" />
                <span>+1(818)-412-2777</span>
              </a>
              {/* <div className="flex items-center justify-center md:justify-start space-x-3 text-gray-300 group">
                <FaMapMarkerAlt className="text-[#006666] group-hover:scale-110 transition-transform duration-300" />
                <span>633 old stone rd, Austin, TEXAS, 78737</span>
              </div> */}
              <a href="https://www.google.com/maps?q=633+old+stone+rd,+Austin,+TEXAS,+78737"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center md:justify-start space-x-3 text-gray-300 hover:text-white transition-all duration-300 group">
                <FaMapMarkerAlt className="text-[#006666] group-hover:scale-110 transition-transform duration-300" />
                <span>633 old stone rd, Austin, TEXAS, 78737</span>
                </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Cognitaxes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;