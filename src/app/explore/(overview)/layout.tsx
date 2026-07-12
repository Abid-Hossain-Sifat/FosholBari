'use client'
import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';

interface ExploreLayoutProps {
  children: React.ReactNode;
}

const categories = ['শাক-সবজি', 'ফলমূল', 'দুগ্ধজাত পণ্য', 'মাংসজাত পণ্য'];
const tags = ['টাটকা', 'সিজনাল', 'খাঁটি', 'অর্গানিক', 'তাজা', 'প্রিমিয়াম'];

const ExploreLayout: React.FC<ExploreLayoutProps> = ({ children }) => {
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [checkedCategories, setCheckedCategories] = useState<string[]>(['শাক-সবজি']);
  const [checkedTags, setCheckedTags] = useState<string[]>([]);
  const [organicOnly, setOrganicOnly] = useState<boolean>(true);

  const toggleCategory = (cat: string) => {
    setCheckedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleTag = (tag: string) => {
    setCheckedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };


  const sidebarVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.6, ease: 'easeOut' } 
    }
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: 'easeOut', delay: 0.1 } 
    }
  };

  const filterItemVariants: Variants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen w-full bg-[#faf9f5] text-[#1A1A1A] dark:bg-[#111a17] dark:text-[#F8FAFC] transition-colors duration-300">
      <main className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

          {/* Sidebar Filters with Motion */}
          <motion.div 
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            className="lg:sticky lg:top-8 h-fit"
          >
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#316312] dark:text-[#8cc655]">ফিল্টার</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">আপনার প্রয়োজন অনুযায়ী বাছাই করুন</p>
            </div>

            <aside className="bg-white dark:bg-[#1a2622] p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              {/* Category */}
              <div className="mb-6">
                <h4 className="text-sm font-bold mb-3 text-[#316312] dark:text-[#8cc655]">ক্যাটাগরি</h4>
                <div className="space-y-2.5">
                  {categories.map((cat) => (
                    <motion.label 
                      key={cat} 
                      variants={filterItemVariants}
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={checkedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="rounded border-gray-300 text-[#316312] focus:ring-[#316312] dark:bg-[#121a18] dark:border-gray-600 dark:focus:ring-[#8cc655]"
                      />
                      {cat}
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold mb-3 text-[#316312] dark:text-[#8cc655]">ট্যাগ</h4>
                <div className="space-y-2.5">
                  {tags.map((tag) => (
                    <motion.label 
                      key={tag} 
                      variants={filterItemVariants}
                      whileHover={{ x: 3 }}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={checkedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                        className="rounded border-gray-300 text-[#316312] focus:ring-[#316312] dark:bg-[#121a18] dark:border-gray-600 dark:focus:ring-[#8cc655]"
                      />
                      {tag}
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-bold mb-3 text-[#316312] dark:text-[#8cc655]">মূল্য সীমা</h4>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#316312] dark:accent-[#8cc655] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>৳০</span>
                  <span>৳{priceRange}{priceRange === 1000 ? '+' : ''}</span>
                </div>
              </div>
            </aside>
          </motion.div>

          {/* Page content with Motion */}
          <motion.div 
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3"
          >
            {children}
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default ExploreLayout;