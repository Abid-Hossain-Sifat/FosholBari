'use client';
import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { ShoppingCart, ChevronDown, ChevronDown as SortIcon } from 'lucide-react';
import Link from 'next/link';
import { exploreCollection } from '../../../lib/data';

interface Product {
  _id: string;
  name: string;
  tag: string;
  category: string;
  unit: string;
  rating?: number;
  reviewCount?: number;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  image: string;
  badge?: { text: string; type: string };
  weights?: string[];
  description?: string;
  bulletPoints?: string[];
}

const ExplorePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await exploreCollection();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 25, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  if (loading) {
    return (
      <div className="max-w-[90%] mx-auto mt-10 text-center py-20 text-gray-500 dark:text-gray-400">
        লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div>
      {/* Top Banner section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#316312] dark:text-[#8cc655]">তাজা পণ্যসমূহ</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{products.length}টি পণ্য পাওয়া গেছে</p>
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full sm:w-auto">
          <select className="appearance-none w-full sm:w-auto bg-white dark:bg-[#1a2622] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 pl-4 pr-9 py-2 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] cursor-pointer">
            <option>নতুন অর্ডার</option>
            <option>মূল্য: কম থেকে বেশি</option>
            <option>মূল্য: বেশি থেকে কম</option>
          </select>
          <SortIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Product Cards Grid */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
      >
        {products.map((product) => (
          <motion.div
            key={product._id}
            variants={cardVariants}
            whileHover={{ y: -6 }}
            className="bg-white dark:bg-[#1a2622] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-black/30 transition-shadow duration-300 flex flex-col justify-between group"
          >
            <Link href={`/explore/${product._id}`} className="block cursor-pointer flex-1">
              {/* Image & Badge */}
              <div className="relative aspect-[4/3] bg-gray-50 dark:bg-[#111a17] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <span
                    className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm ${
                      product.badge.type === 'new'
                        ? 'bg-[#316312] text-white dark:bg-[#8cc655] dark:text-[#111a17]'
                        : 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400'
                    }`}
                  >
                    {product.badge.text}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[#316312]/70 dark:text-[#8cc655]/70">
                  {product.tag}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-[#254b0e] dark:text-gray-100 mt-0.5 line-clamp-1 group-hover:text-[#316312] dark:group-hover:text-[#8cc655] transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.unit}</p>
              </div>
            </Link>

            {/* Price & Action Button */}
            <div className="p-3 sm:p-4 pt-0">
              <div className="flex items-center justify-between mt-1 gap-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
                    ৳{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ৳{product.originalPrice}
                    </span>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 bg-[#316312] hover:bg-[#254b0e] dark:bg-[#8cc655] dark:hover:bg-[#7bb344] text-white dark:text-[#111a17] text-xs font-semibold px-3 py-2 rounded-full transition-colors duration-200 whitespace-nowrap shadow-sm"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">এখনই ক্রয় করুন</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Load More Button */}
      <div className="flex justify-center mt-12">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2622] text-gray-700 dark:text-gray-200 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm"
        >
          আরও দেখুন <ChevronDown className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default ExplorePage;