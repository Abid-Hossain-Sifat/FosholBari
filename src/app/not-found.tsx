'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Home, HelpCircle, ShieldCheck, Truck, Award } from 'lucide-react';

const NotFound = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#faf9f5] dark:bg-[#111a17] transition-colors duration-300 py-8 sm:py-12 px-4">
      {/* 80% Main Container */}
      <div className="w-full md:w-[80%] max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center justify-items-center">
        
        {/* Left Side: Image Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative w-full max-w-[280px] sm:max-w-[380px] md:max-w-[450px] aspect-square p-4 sm:p-6 bg-white dark:bg-[#1a2622] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center"
        >
          {/* Light Mode Image */}
          <div className="block dark:hidden w-full h-full relative rounded-2xl overflow-hidden">
            <Image
              src="/Assets/404D.jpg"
              alt="404 Not Found Light"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Dark Mode Image */}
          <div className="hidden dark:block w-full h-full relative rounded-2xl overflow-hidden">
            <Image
              src="/Assets/404N.png"
              alt="404 Not Found Dark"
              fill
              priority
              className="object-cover"
            />
          </div>
        </motion.div>

        {/* Right Side: Text & Content Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full text-center md:text-left space-y-5 sm:space-y-6"
        >
          {/* Title */}
          <motion.h1 
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#316312] dark:text-[#8cc655] leading-tight"
          >
            দুঃখিত, এই পাতাটি খুঁজে পাওয়া যায়নি!
          </motion.h1>

          {/* Description */}
          <motion.p 
            variants={itemVariants}
            className="text-gray-600 dark:text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mx-auto md:mx-0"
          >
            মনে হচ্ছে আপনি ভুল কোনো রাস্তায় চলে এসেছেন। চিন্তার কিছু নেই, নিচে দেওয়া বাটনের মাধ্যমে আপনি আমাদের হোমপেজে ফিরে যেতে পারেন।
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 pt-2"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/"
                className="flex items-center gap-2 bg-[#316312] hover:bg-[#254b0e] dark:bg-[#8cc655] dark:hover:bg-[#7bb344] text-white dark:text-[#111a17] font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition duration-200 shadow-sm text-sm sm:text-base"
              >
                <Home size={18} className="sm:w-5 sm:h-5" />
                হোমপেজে ফিরে যান
              </Link>
            </motion.div>
          </motion.div>

          {/* Bottom Features/Badges */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 sm:pt-6 max-w-md mx-auto md:mx-0"
          >
            <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-gray-50 dark:bg-[#1a2622] border border-gray-100 dark:border-gray-800 rounded-xl text-center transition-shadow duration-200 hover:shadow-sm">
              <Award size={18} className="text-[#316312] dark:text-[#8cc655] mb-1 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">১০০% অর্গানিক</span>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-gray-50 dark:bg-[#1a2622] border border-gray-100 dark:border-gray-800 rounded-xl text-center transition-shadow duration-200 hover:shadow-sm">
              <Truck size={18} className="text-[#316312] dark:text-[#8cc655] mb-1 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">দ্রুত ডেলিভারি</span>
            </motion.div>

            <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center justify-center p-2.5 sm:p-3 bg-gray-50 dark:bg-[#1a2622] border border-gray-100 dark:border-gray-800 rounded-xl text-center transition-shadow duration-200 hover:shadow-sm">
              <ShieldCheck size={18} className="text-[#316312] dark:text-[#8cc655] mb-1 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">নিরাপদ পেমেন্ট</span>
            </motion.div>
          </motion.div>

        </motion.div>

      </div>
    </div>
  );
};

export default NotFound;