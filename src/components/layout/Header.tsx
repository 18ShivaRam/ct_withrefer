'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', currentUser.id)
          .single();
        setIsAdmin(!!profile?.is_admin);
      } else {
        setIsAdmin(false);
      }
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const nextUser = session?.user || null;
      setUser(nextUser);
      if (nextUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', nextUser.id)
          .single();
        setIsAdmin(!!profile?.is_admin);
      } else {
        setIsAdmin(false);
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logosvg1.jpg"
            alt="Cognitax Logo"
            width={160}
            height={40}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/" className="text-gray-700 hover:text-[#006666] font-medium transition-colors duration-300">
            Home
          </Link>
          <Link href="/individual" className="text-gray-700 hover:text-[#006666] font-medium transition-colors duration-300">
            Individual
          </Link>
          <Link href="/business" className="text-gray-700 hover:text-[#006666] font-medium transition-colors duration-300">
            Business
          </Link>
          <Link href="/refund" className="text-gray-700 hover:text-[#006666] font-medium transition-colors duration-300">
            Refund
          </Link>
          <Link href="/prices" className="text-gray-700 hover:text-[#006666] font-medium transition-colors duration-300">
            Prices
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-[#006666] font-medium transition-colors duration-300">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex">
          {!user ? (
            <div className="flex items-center space-x-3">
              <Link 
                href="/auth/register" 
                className="border border-[#006666] text-[#006666] font-medium px-6 py-2 rounded-md hover:bg-[#f0fdfa] transition-all duration-300"
              >
                Register
              </Link>
              <Link 
                href="/auth/login" 
                className="bg-[#006666] text-white font-medium px-6 py-2 rounded-md hover:bg-[#087830] transition-all duration-300"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                href={isAdmin ? '/admin' : '/dashboard'} 
                className="text-gray-700 hover:text-[#006666] font-medium transition-colors duration-300"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleSignOut}
                className="flex items-center bg-[#006666] text-white font-medium px-6 py-2 rounded-md hover:bg-[#087830] transition-all duration-300"
              >
                <FaSignOutAlt className="mr-2" /> Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="md:hidden bg-white shadow-lg overflow-hidden"
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <Link 
            href="/" 
            className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-300 px-4 py-2 rounded-lg" 
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link 
            href="/individual" 
            className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-300 px-4 py-2 rounded-lg" 
            onClick={toggleMenu}
          >
            Individual
          </Link>
           <Link 
            href="/business" 
            className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-300 px-4 py-2 rounded-lg" 
            onClick={toggleMenu}
          >
            Business
          </Link>
          {/* Removed About Us link to match desktop navigation */}
          <Link 
            href="/refund" 
            className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-300 px-4 py-2 rounded-lg" 
            onClick={toggleMenu}
          >
            Refund
          </Link>
          <Link 
            href="/prices" 
            className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-300 px-4 py-2 rounded-lg" 
            onClick={toggleMenu}
          >
            Prices
          </Link>
          <Link 
            href="/contact" 
            className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-300 px-4 py-2 rounded-lg" 
            onClick={toggleMenu}
          >
            Contact
          </Link>
          {!user ? (
            <div className="flex items-center space-x-3">
              <Link 
                href="/auth/register" 
                className="border border-[#006666] text-[#006666] px-6 py-3 rounded-lg hover:bg-[#f0fdfa] transition-all duration-300 text-center transform hover:scale-105" 
                onClick={toggleMenu}
              >
                Register
              </Link>
              <Link 
                href="/auth/login" 
                className="bg-[#006666] text-white px-6 py-3 rounded-lg hover:bg-[#087830] transition-all duration-300 text-center transform hover:scale-105" 
                onClick={toggleMenu}
              >
                Login
              </Link>
            </div>
          ) : (
            <>
              <Link 
                href={isAdmin ? '/admin' : '/dashboard'} 
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-300 px-4 py-2 rounded-lg"
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
              <button 
                onClick={() => {
                  handleSignOut();
                  toggleMenu();
                }}
                className="flex items-center justify-center bg-[#006666] text-white px-6 py-3 rounded-lg hover:bg-[#087830] transition-all duration-300 text-center transform hover:scale-105 w-full"
              >
                <FaSignOutAlt className="mr-2" /> Sign Out
              </button>
            </>
          )}
        </div>
      </motion.div>
    </header>

  );
};

export default Header;