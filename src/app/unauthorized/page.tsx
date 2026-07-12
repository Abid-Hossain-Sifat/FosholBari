'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Home, ShieldAlert } from 'lucide-react';

const UnauthorizedPage = () => {
  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.92, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.12 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center py-12 px-4 overflow-hidden">
      
      {/* Light Mode Background */}
      <div className="absolute inset-0 block dark:hidden z-0">
        <Image 
          src="/Assets/UnauthoBgD.png" 
          alt="Background Light" 
          fill 
          priority 
          className="object-cover object-center brightness-[0.95]"
        />
        <div className="absolute inset-0 bg-[#faf9f5]/40 backdrop-blur-[2px]" />
      </div>

      {/* Dark Mode Background */}
      <div className="absolute inset-0 hidden dark:block z-0">
        <Image 
          src="/Assets/UnauthoBgN.png" 
          alt="Background Dark" 
          fill 
          priority 
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#111a17]/70 backdrop-blur-[2px]" />
      </div>

      {/* ================= MAIN CARD CONTAINER (80% Aligned) ================= */}
      <motion.div 
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full md:w-[80%] max-w-2xl bg-[#faf9f5] dark:bg-[#1a2622] border border-stone-200/60 dark:border-zinc-800/80 rounded-3xl shadow-2xl p-6 sm:p-12 text-center space-y-6 sm:space-y-8"
      >
        
        {/* Center Image/Icon Area */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 p-2 bg-white dark:bg-zinc-850 rounded-full shadow-inner flex items-center justify-center border border-stone-100 dark:border-zinc-700/30">
            {/* Light Mode Image */}
            <div className="block dark:hidden w-full h-full relative rounded-full overflow-hidden">
              <Image 
                src="/Assets/unauthorizeD.jpg" 
                alt="Unauthorized Light" 
                fill 
                className="object-cover"
              />
            </div>
            {/* Dark Mode Image */}
            <div className="hidden dark:block w-full h-full relative rounded-full overflow-hidden">
              <Image 
                src="/Assets/unauthorizeN.png" 
                alt="Unauthorized Dark" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Text Content */}
        <div className="space-y-3 sm:space-y-4">
          <motion.h1 
            variants={itemVariants}
            className="text-2xl sm:text-4xl font-extrabold text-[#316312] dark:text-[#8cc655] leading-tight px-2 sm:px-6"
          >
            দুঃখিত, আপনার এই পাতাটি দেখার অনুমতি নেই!
          </motion.h1>
        </div>

        {/* Action Button */}
        <motion.div variants={itemVariants} className="pt-2">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="inline-block">
            <Link
              href="/"
              className="flex items-center gap-2 bg-transparent hover:bg-[#316312] hover:text-white dark:hover:bg-[#8cc655] dark:hover:text-[#111a17] text-[#316312] dark:text-[#8cc655] font-semibold px-6 py-2.5 sm:py-3 rounded-xl border-2 border-[#316312]/60 dark:border-[#8cc655]/60 transition-all duration-300 text-sm sm:text-base shadow-sm"
            >
              <Home size={18} />
              হোমপেজে ফিরে যান
            </Link>
          </motion.div>
        </motion.div>

        {/* Divider Line */}
        <motion.div variants={itemVariants} className="border-t border-stone-200/60 dark:border-zinc-800 pt-4 sm:pt-6">
          <p className="text-[11px] sm:text-xs text-stone-400 dark:text-gray-500 flex items-center justify-center gap-1">
            <ShieldAlert size={12} className="text-[#316312]/60 dark:text-[#8cc655]/60" />
            আপনার তথ্য আমাদের কাছে নিরাপদ ও সংরক্ষিত।
          </p>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;