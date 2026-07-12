'use client'
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ShoppingCart, Star, ShieldCheck, Truck, RefreshCw, ChevronRight, Check, Heart } from 'lucide-react';
import Link from 'next/link';

interface Product {
  name: string;
  tag: string;
  category: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice: number;
  discountPercent: number;
  image: string;
  weights: string[];
  description: string;
  bulletPoints: string[];
}

const allProductsData: Record<number, Product> = {
  1: {
    name: "দেশি টমেটো (ফ্রেশ)",
    tag: "টাটকা",
    category: "শাক-সবজি",
    rating: 4.8,
    reviewCount: 123,
    price: 60,
    originalPrice: 80,
    discountPercent: 25,
    image: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=600",
    weights: ["২৫০ গ্রাম", "৫০০ গ্রাম", "১ কেজি"],
    description: "আমাদের দেশি টমেটো সরাসরি কৃষকের জমি থেকে সংগ্রহ করা হয়। কোনো প্রকার ক্ষতিকর রাসায়নিক ছাড়াই প্রাকৃতিকভাবে বেড়ে ওঠা এই টমেটো স্বাদে এবং পুষ্টিতে অতুলনীয়। রান্না হোক বা সালাদ, টাটকা টমেটোর আসল স্বাদ পেতে আজই অর্ডার করুন।",
    bulletPoints: ["সরাসরি বাগান থেকে সংগৃহীত।", "উচ্চ ভিটামিন-সি সমৃদ্ধ।", "কোনো প্রিজারভেটিভ নেই।", "নিটোল রসালো এবং সুস্বাদু।"]
  },
  2: {
    name: "সিজনাল ফলের ঝুড়ি",
    tag: "সিজনাল",
    category: "ফলমূল",
    rating: 4.9,
    reviewCount: 85,
    price: 350,
    originalPrice: 400,
    discountPercent: 12,
    image: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600",
    weights: ["১ ঝুড়ি", "২ ঝুড়ি"],
    description: "বাগান থেকে বাছাইকৃত সেরা ও মিষ্টি সিজনাল ফলের সমাহার। আম, জাম, লিচু কিংবা আপেল-কমলা যা-ই বলুন, ঋতুভিত্তিক সেরা ফলগুলো পাবেন এক ফ্রেমেই।",
    bulletPoints: ["১০০% মিষ্টি ও রসালো ফলের গ্যারান্টি।", "কোনো কেমিক্যাল বা ফরমালিন মুক্ত।", "পরিবার বা উপহার দেওয়ার জন্য সেরা প্যাক।"]
  },
  3: {
    name: "খাঁটি গালা ঘি জার",
    tag: "খাঁটি",
    category: "দুগ্ধজাত পণ্য",
    rating: 4.7,
    reviewCount: 96,
    price: 90,
    originalPrice: 100,
    discountPercent: 10,
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600",
    weights: ["২০০ গ্রাম", "৫০০ গ্রাম", "১ লিটার"],
    description: "গ্রামের খামারিদের থেকে আনা খাঁটি দুধের মাখন থেকে তৈরি সুগন্ধি গালা ঘি। গরম ভাতে কিংবা রান্নায় স্বাদ ও ঘ্রাণ দ্বিগুণ করতে এর জুড়ি নেই।",
    bulletPoints: ["ঐতিহ্যবাহী পদ্ধতিতে তৈরি।", "তীব্র ও আকর্ষণীয় সুবাস।", "দীর্ঘদিন সংরক্ষণযোগ্য।"]
  },
  4: {
    name: "অর্গানিক লাল চাল",
    tag: "অর্গানিক",
    category: "খাদ্যশস্য",
    rating: 4.6,
    reviewCount: 54,
    price: 120,
    originalPrice: 150,
    discountPercent: 20,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600",
    weights: ["১ কেজি", "৫ কেজি", "১০ কেজি"],
    description: "ডায়াবেটিস ও স্বাস্থ্য সচেতন মানুষের জন্য ফাইবার সমৃদ্ধ ঢেঁকি ছাঁটা অর্গানিক লাল চাল। পুষ্টিগুণে ভরপুর এই চাল দৈনন্দিন ডায়েটের জন্য দারুণ উপকারী।",
    bulletPoints: ["ফাইবারে ভরপুর ও লো-জিআই সমৃদ্ধ।", "মিলিশ পোলিশ ছাড়া প্রাকৃতিক লাল চাল।", "সহজে হজমযোগ্য।"]
  },
  5: {
    name: "তাজা পালং শাক",
    tag: "তাজা",
    category: "শাক-সবজি",
    rating: 4.5,
    reviewCount: 42,
    price: 30,
    originalPrice: 40,
    discountPercent: 25,
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600",
    weights: ["১ আঁটি", "৩ আঁটি"],
    description: "প্রতিদিন সকালে মাঠ থেকে তুলে আনা তাজা ও সবুজ পালং শাক। আয়রন এবং পুষ্টি উপাদানে ভরপুর, যা আপনার স্বাস্থ্যের সুরক্ষায় দারুণ কার্যকরী।",
    bulletPoints: ["বিষমুক্ত চাষাবাদ।", "অত্যন্ত কচি ও তাজা পাতা।", "আয়রন ও ভিটামিন এ-র অন্যতম উৎস।"]
  },
  6: {
    name: "প্রিমিয়াম ফলের বক্স",
    tag: "প্রিমিয়াম",
    category: "ফলমূল",
    rating: 5.0,
    reviewCount: 210,
    price: 450,
    originalPrice: 500,
    discountPercent: 10,
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600",
    weights: ["১ বক্স (স্ট্যান্ডার্ড)", "১ লার্জ বক্স"],
    description: "দেশী ও বিদেশী প্রিমিয়াম কোয়ালিটির বাছাই করা ফলের প্রিমিয়াম প্যাক। করপোরেট গিফটিং কিংবা স্পেশাল ওকেশন বা উৎসবের জন্য এটি একদম পারফেক্ট।",
    bulletPoints: ["আমদানিকৃত প্রিমিয়াম ক্রিস্পি ফল।", "আকর্ষণীয় ও হাইজেনিক বক্স প্যাকেজিং।", "ভিটামিন ও খনিজের পাওয়ারহাউস।"]
  }
};

const staticFeatures = [
  { icon: ShieldCheck, text: "১০০% অর্গানিক" },
  { icon: Truck, text: "একই দিনে ডেলিভারি" },
  { icon: RefreshCw, text: "ফ্রেশ গ্যারান্টি" }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.08 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } }
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const tabContentVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } }
};

const ExploreDetails = () => {
  const params = useParams();
  const productId = Number(params.id);
  const product = allProductsData[productId];

  const [selectedWeight, setSelectedWeight] = useState<string>(product?.weights[0] || "");
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition'>('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleBuyNow = () => {
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-[#faf9f5] dark:bg-[#111a17] gap-4"
      >
        <h2 className="text-xl font-bold">দুঃখিত, পণ্যটি পাওয়া যায়নি!</h2>
        <Link href="/explore" className="bg-[#316312] hover:bg-[#254b0e] transition text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
          এক্সপ্লোর পেজে ফিরুন
        </Link>
      </motion.div>
    );
  }

  const fullStars = Math.floor(product.rating);
  const hasHalfStar = product.rating - fullStars >= 0.5;

  return (
    <div className="min-h-screen w-full bg-[#faf9f5] text-[#1A1A1A] dark:bg-[#111a17] dark:text-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6 transition-colors duration-300">

      <div className="w-full max-w-[80%] mx-auto">

        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 select-none"
        >
          <Link href="/" className="hover:text-[#316312] dark:hover:text-[#8cc655] transition">হোম</Link>
          <ChevronRight size={14} />
          <Link href="/explore" className="hover:text-[#316312] dark:hover:text-[#8cc655] transition">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-[#316312] dark:text-[#8cc655] font-medium truncate max-w-[160px] sm:max-w-none">{product.name}</span>
        </motion.nav>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14"
        >
          {/* LEFT SIDE: IMAGE */}
          <motion.div variants={itemVariants} className="relative">
            <motion.div
              variants={imageVariants}
              className="relative aspect-square rounded-3xl overflow-hidden bg-white dark:bg-[#1a2622] border border-gray-100 dark:border-gray-800 shadow-sm group"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Favorite Button */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setIsFavorite(prev => !prev)}
                className="absolute top-4 right-4 bg-white/90 dark:bg-[#111a17]/90 backdrop-blur p-2.5 rounded-full shadow-md"
              >
                <motion.div animate={{ scale: isFavorite ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.35 }}>
                  <Heart
                    size={18}
                    className={isFavorite ? "text-red-500" : "text-gray-400"}
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                </motion.div>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE: INFO */}
          <motion.div variants={itemVariants} className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs font-bold uppercase tracking-wider bg-[#316312]/10 dark:bg-[#8cc655]/10 text-[#316312] dark:text-[#8cc655] px-2.5 py-1 rounded-md inline-block"
                >
                  {product.tag}
                </motion.span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#254b0e] dark:text-gray-50 mt-3 leading-tight">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < fullStars || (i === fullStars && hasHalfStar) ? "currentColor" : "none"}
                      className={i < fullStars || (i === fullStars && hasHalfStar) ? "" : "text-gray-300 dark:text-gray-700"}
                    />
                  ))}
                </div>
                <span className="font-bold text-gray-700 dark:text-gray-200">{product.rating}</span>
                <span className="text-gray-400 dark:text-gray-500">({product.reviewCount} রিভিউ)</span>
              </div>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                  ৳{product.price}
                </span>
              </div>

              {/* Weights */}
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400">ওজন নির্বাচন করুন:</h4>
                <div className="flex flex-wrap gap-2.5">
                  {product.weights.map((weight) => (
                    <motion.button
                      key={weight}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedWeight(weight)}
                      className={`relative text-xs sm:text-sm px-4 py-2 rounded-xl font-medium border transition-colors ${
                        selectedWeight === weight
                          ? 'bg-[#316312] text-white border-[#316312] dark:bg-[#8cc655] dark:text-[#111a17] dark:border-[#8cc655]'
                          : 'bg-white dark:bg-[#1a2622] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-[#316312] dark:hover:border-[#8cc655]'
                      }`}
                    >
                      {weight}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={justAdded}
                  className="w-full flex items-center justify-center gap-2 bg-[#316312] hover:bg-[#254b0e] dark:bg-[#8cc655] dark:hover:bg-[#7bb344] text-white dark:text-[#111a17] font-bold py-3 px-6 rounded-xl shadow-md text-sm sm:text-base disabled:opacity-90"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {justAdded ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={18} /> অর্ডার নিশ্চিত হয়েছে
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart size={18} /> এখনই ক্রয় করুন
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-2 bg-white dark:bg-[#1a2622] border border-gray-100 dark:border-gray-800 p-3.5 rounded-2xl text-center shadow-sm">
              {staticFeatures.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex flex-col items-center justify-center space-y-1 p-1"
                  >
                    <Icon className="w-5 h-5 text-[#316312] dark:text-[#8cc655]" />
                    <span className="text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-300">{item.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* TABS BOTTOM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="flex gap-6 border-b border-gray-100 dark:border-gray-800 mb-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-2.5 text-sm sm:text-base font-bold transition-colors relative ${activeTab === 'description' ? 'text-[#316312] dark:text-[#8cc655]' : 'text-gray-400'}`}
            >
              বিবরণ
              {activeTab === 'description' && (
                <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#316312] dark:bg-[#8cc655]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('nutrition')}
              className={`pb-2.5 text-sm sm:text-base font-bold transition-colors relative ${activeTab === 'nutrition' ? 'text-[#316312] dark:text-[#8cc655]' : 'text-gray-400'}`}
            >
              পুষ্টিগুণ
              {activeTab === 'nutrition' && (
                <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#316312] dark:bg-[#8cc655]" />
              )}
            </button>
          </div>

          <div className="min-h-[120px]">
            <AnimatePresence mode="wait">
              {activeTab === 'description' ? (
                <motion.div
                  key="description"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
                >
                  <p>{product.description}</p>
                  <ul className="list-disc pl-5 space-y-1.5 font-medium">
                    {product.bulletPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div
                  key="nutrition"
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="max-w-md bg-white dark:bg-[#1a2622] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800"
                >
                  <div className="flex justify-between p-3 text-sm">
                    <span className="font-medium text-gray-500">অর্গানিক লেভেল</span>
                    <span className="font-bold text-[#254b0e] dark:text-gray-200">১০০% পিউর</span>
                  </div>
                  <div className="flex justify-between p-3 text-sm">
                    <span className="font-medium text-gray-500">সংরক্ষণ কাল</span>
                    <span className="font-bold text-[#254b0e] dark:text-gray-200">ন্যাচারাল ফ্রেশ</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExploreDetails;