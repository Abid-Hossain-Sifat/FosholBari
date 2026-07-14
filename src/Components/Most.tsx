"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { exploreCollection } from "../lib/data";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface Product {
  _id: string;
  name: string;
  tag: string;
  category: string;
  unit: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: { text: string; type: string };
}

const DISPLAY_COUNT = 4;

function shuffleAndPick<T>(items: T[], count: number): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

const Most = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const json = await exploreCollection({ limit: 24 });
        const pool: Product[] = json.data || [];
        setProducts(shuffleAndPick(pool, DISPLAY_COUNT));
      } catch (err) {
        console.error("Error loading popular products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div
      className={`w-full py-10 sm:py-12 md:py-14 transition-colors duration-300 ${
        darkMode ? "bg-[#1B2420]" : "bg-[#faf9f5]"
      }`}
    >
      <div className="max-w-[92%] sm:max-w-[88%] md:max-w-[85%] lg:max-w-[80%] mx-auto">
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`text-lg sm:text-xl md:text-2xl font-bold ${
              darkMode ? "text-[#9ece6a]" : "text-emerald-800"
            }`}
          >
            জনপ্রিয় পণ্যসমূহ
          </motion.h2>

          <Link
            href="/explore"
            className={`text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
              darkMode
                ? "text-[#9ece6a] hover:text-[#b5e08a]"
                : "text-emerald-700 hover:text-emerald-900"
            }`}
          >
            সবগুলো দেখুন
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {Array.from({ length: DISPLAY_COUNT }).map((_, i) => (
              <div
                key={i}
                className={`rounded-2xl border overflow-hidden animate-pulse ${
                  darkMode
                    ? "bg-[#16201c] border-[#26332d]"
                    : "bg-white border-gray-200"
                }`}
              >
                <div
                  className={`aspect-[4/3] ${
                    darkMode ? "bg-[#111a17]" : "bg-gray-100"
                  }`}
                />
                <div className="p-3 sm:p-4 space-y-2">
                  <div
                    className={`h-2.5 rounded w-1/3 ${
                      darkMode ? "bg-[#26332d]" : "bg-gray-100"
                    }`}
                  />
                  <div
                    className={`h-4 rounded w-4/5 ${
                      darkMode ? "bg-[#26332d]" : "bg-gray-100"
                    }`}
                  />
                  <div
                    className={`h-3 rounded w-1/2 ${
                      darkMode ? "bg-[#26332d]" : "bg-gray-100"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center py-12 rounded-2xl border ${
              darkMode
                ? "bg-[#16201c] border-[#26332d] text-gray-400"
                : "bg-white border-gray-200 text-gray-500"
            }`}
          >
            <p className="text-sm sm:text-base">এখনো কোনো পণ্য যোগ করা হয়নি</p>
          </motion.div>
        ) : (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
          >
            {products.map((product) => (
              <motion.div
                key={product._id}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className={`rounded-2xl border overflow-hidden flex flex-col transition-shadow duration-300 group ${
                  darkMode
                    ? "bg-[#16201c] border-[#26332d] hover:border-[#9ece6a]/40 hover:shadow-lg hover:shadow-black/20"
                    : "bg-white border-gray-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/5"
                }`}
              >
                <Link href={`/explore/${product._id}`} className="block flex-1">
                  <div
                    className={`relative aspect-[4/3] overflow-hidden ${
                      darkMode ? "bg-[#111a17]" : "bg-gray-50"
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.badge && (
                      <span
                        className={`absolute top-2 left-2 sm:top-3 sm:left-3 text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-medium shadow-sm ${
                          product.badge.type === "new"
                            ? darkMode
                              ? "bg-[#8cc655] text-[#111a17]"
                              : "bg-[#316312] text-white"
                            : "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                        }`}
                      >
                        {product.badge.text}
                      </span>
                    )}
                  </div>

                  <div className="p-3 sm:p-4">
                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide ${
                        darkMode ? "text-[#9ece6a]/70" : "text-emerald-700/70"
                      }`}
                    >
                      {product.tag}
                    </span>
                    <h3
                      className={`text-sm sm:text-base font-bold mt-0.5 line-clamp-1 transition-colors ${
                        darkMode
                          ? "text-gray-100 group-hover:text-[#9ece6a]"
                          : "text-emerald-950 group-hover:text-emerald-700"
                      }`}
                    >
                      {product.name}
                    </h3>
                    <p
                      className={`text-xs mt-0.5 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {product.unit}
                    </p>
                  </div>
                </Link>

                <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="flex items-baseline gap-1 min-w-0">
                      <span
                        className={`text-sm sm:text-base font-extrabold ${
                          darkMode ? "text-gray-100" : "text-emerald-950"
                        }`}
                      >
                        ৳{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                          ৳{product.originalPrice}
                        </span>
                      )}
                    </div>

                    <Link href={`/explore/${product._id}`} className="shrink-0">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`inline-block px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-white transition-colors ${
                          darkMode
                            ? "bg-[#316312] hover:bg-[#3d7c16]"
                            : "bg-[#316312] hover:bg-[#264d0e]"
                        }`}
                      >
                        বিস্তারিত
                      </motion.span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Most;
