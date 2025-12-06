'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaChevronLeft, FaChevronRight, FaQuoteLeft } from 'react-icons/fa';

interface Review {
  subject: string;
  review_message: string;
  stars: number;
}

export default function TestimonialSlider() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/reviews');
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        if (data.reviews && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [reviews.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (loading) return null;
  if (reviews.length === 0) return null;

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative overflow-hidden min-h-[300px] flex flex-col justify-center items-center text-center">
        {/* Decorative Quote Icon */}
        <div className="absolute top-4 left-4 text-[#006666] opacity-10">
          <FaQuoteLeft size={64} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full z-10"
          >
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={24}
                  className={i < reviews[currentIndex].stars ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>

            {/* Message */}
            <p className="text-lg md:text-xl text-gray-700 italic mb-6 leading-relaxed">
              "{reviews[currentIndex].review_message}"
            </p>

            {/* Subject/Author */}
            <h4 className="text-[#006666] font-bold text-xl">
              {reviews[currentIndex].subject}
            </h4>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-20">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full bg-gray-100 text-[#006666] hover:bg-[#006666] hover:text-white transition-colors shadow-md"
            aria-label="Previous review"
          >
            <FaChevronLeft size={20} />
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-20">
          <button
            onClick={nextSlide}
            className="p-2 rounded-full bg-gray-100 text-[#006666] hover:bg-[#006666] hover:text-white transition-colors shadow-md"
            aria-label="Next review"
          >
            <FaChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-[#006666] w-6' : 'bg-gray-300'
              }`}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
