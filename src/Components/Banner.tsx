'use client'
import React, { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

import B1 from '../../public/Assets/B1.jpg';
import B2 from '../../public/Assets/B2.jpg';
import B3 from '../../public/Assets/B3.jpg';

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface Slide {
  image: string | { src: string };
  eyebrow: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

const SLIDE_DURATION = 8000; // ms

const Banner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === 'dark';

  const slides: Slide[] = [
    {
      image: B2,
      eyebrow: 'টাটকা সবজি',
      title: 'খামার থেকে সরাসরি\nআপনার ঘরে',
      subtitle: 'সবচেয়ে টাটকা সবজি দ্রুত হোমে',
      buttonText: 'শপিং করুন',
      buttonLink: '/explore?categories=শাক-সবজি',
    },
    {
      image: B3,
      eyebrow: 'মৌসুমি ফুল',
      title: 'মৌসুমি ফুলের সেরা\nসংগ্রহ এখানে',
      subtitle: 'প্রকৃতির সেরা ফুল সরাসরি হাতে',
      buttonText: 'সংগ্রহ দেখুন',
      buttonLink: '/explore?categories=ফলমূল',
    },
    {
      image: B1,
      eyebrow: 'খাঁটি নিরাপদ',
      title: 'খাঁটি দুগ্ধজাত পণ্য\nপ্রতিদিন সতেজ',
      subtitle: 'সুস্বাস্থ্য নিশ্চিত করুন খাঁটি ডেইরি',
      buttonText: 'অর্ডার দিন',
      buttonLink: '/explore?categories=দুগ্ধজাত+পণ্য',
    },
  ];

  const next = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  useEffect(() => {
    const slideInterval = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(slideInterval);
  }, [next]);

  const getImageUrl = (imageSource: string | { src: string }): string => {
    if (imageSource && typeof imageSource === 'object' && 'src' in imageSource) {
      return imageSource.src;
    }
    return imageSource as string;
  };

  // Overlay stays dark regardless of theme (it's a photo hero — text needs
  // contrast against the image either way), but chrome elements (badge,
  // arrows, accent colors) follow the site theme like the Navbar does.
  const overlay = darkMode
    ? 'linear-gradient(100deg, rgba(10,20,10,0.85) 0%, rgba(10,20,10,0.58) 42%, rgba(10,20,10,0.18) 68%)'
    : 'linear-gradient(100deg, rgba(20,26,20,0.72) 0%, rgba(20,26,20,0.46) 42%, rgba(20,26,20,0.12) 68%)';

  const accent = darkMode ? '#9ece6a' : '#316312';

  return (
    <div className={`relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] min-h-[480px] max-h-[780px] overflow-hidden ${darkMode ? 'bg-[#1B2420]' : 'bg-[#faf9f5]'}`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@500;600;700;800&family=Hind+Siliguri:wght@400;500;600&display=swap');
        .banner-display { font-family: 'Baloo Da 2', 'Hind Siliguri', sans-serif; }
        .banner-body { font-family: 'Hind Siliguri', sans-serif; }
      `}</style>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          {/* Slow Ken-Burns zoom on the background so the motion reads as
              deliberate/premium rather than a quick snap */}
          <motion.div
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: SLIDE_DURATION / 1000 + 1.4, ease: 'linear' }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `${overlay}, url(${getImageUrl(slides[currentSlide].image)})`,
            }}
          />

          {/* Content Area — same container as Navbar (max-w-[90%] lg:max-w-[80%]
              mx-auto) so the text's left edge lines up exactly with the logo */}
          <div className="relative h-full max-w-[90%] lg:max-w-[80%] mx-auto text-white w-full flex items-center">
            <div className="flex flex-col items-start space-y-4 sm:space-y-5 max-w-xl">

              {/* Eyebrow badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                className={`banner-body flex items-center gap-2 rounded-full backdrop-blur-sm border px-4 py-1.5 text-xs sm:text-sm font-medium tracking-wide ${
                  darkMode ? 'bg-white/10 border-white/20 text-[#c7e8a0]' : 'bg-white/15 border-white/25 text-[#dff2c2]'
                }`}
              >
                <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2.2} />
                {slides[currentSlide].eyebrow}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="banner-display text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-bold leading-[1.15] whitespace-pre-line tracking-tight drop-shadow-lg"
              >
                {slides[currentSlide].title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="banner-body text-base sm:text-lg md:text-xl font-normal text-gray-200 tracking-wide max-w-xl"
              >
                {slides[currentSlide].subtitle}
              </motion.p>

              {/* CTA + trust badges */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 pt-1"
              >
                <Link href={slides[currentSlide].buttonLink} className="inline-block">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ backgroundColor: accent }}
                    className={`banner-body inline-block font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors duration-200 text-sm sm:text-base shadow-xl uppercase tracking-wider hover:brightness-95 ${
                      darkMode ? 'text-gray-900' : 'text-white'
                    }`}
                  >
                    {slides[currentSlide].buttonText}
                  </motion.span>
                </Link>

                <div className="banner-body hidden sm:flex items-center gap-4 text-xs text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                    ১০০% প্রাকৃতিক
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                    দ্রুত হোম ডেলিভারি
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Side prev/next arrows and dot indicators both removed per request —
          the banner now auto-rotates with zero visual controls/cues. */}
    </div>
  );
};

export default Banner;