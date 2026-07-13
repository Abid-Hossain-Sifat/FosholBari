'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { motion, Variants } from 'framer-motion';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { exploreFiltersMeta } from '../../../lib/data';

interface ExploreLayoutProps {
  children: React.ReactNode;
}

const ExploreLayoutContent: React.FC<ExploreLayoutProps> = ({ children }) => {
  // 1. Hooks (Next.js & React State/Effects)
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [localPrice, setLocalPrice] = useState<number>(() => {
    const priceParam = searchParams.get('maxPrice');
    return priceParam ? Number(priceParam) : 1000;
  });

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const data = await exploreFiltersMeta();
        setCategories(data.categories || []);
        setTags(data.tags || []);
      } catch (err) {
        console.error("Error loading filters:", err);
      }
    };
    loadMeta();
  }, []);

  const priceParam = searchParams.get('maxPrice');
  const priceRange = priceParam ? Number(priceParam) : 1000;

  // 2. Non-hook variable declarations
  const categoriesParam = searchParams.get('categories');
  const checkedCategories = categoriesParam 
    ? categoriesParam.split(',').filter(Boolean)
    : [];
  
  const isAllCategoriesSelected = checkedCategories.length === 0;

  const tagsParam = searchParams.get('tags');
  const checkedTags = tagsParam
    ? tagsParam.split(',').filter(Boolean)
    : [];

  const isAllTagsSelected = checkedTags.length === 0;

  const updateFilters = (newCategories: string[], newTags: string[], newPrice: number) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    } else {
      params.delete('categories');
    }

    if (newTags.length > 0) {
      params.set('tags', newTags.join(','));
    } else {
      params.delete('tags');
    }

    if (newPrice < 1000) {
      params.set('maxPrice', newPrice.toString());
    } else {
      params.delete('maxPrice');
    }

    // Always reset to page 1 when filters change
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleCategory = (cat: string) => {
    const updated = checkedCategories.includes(cat)
      ? checkedCategories.filter((c) => c !== cat)
      : [...checkedCategories, cat];
    updateFilters(updated, checkedTags, priceRange);
  };

  const toggleAllCategories = () => {
    if (!isAllCategoriesSelected) {
      updateFilters([], checkedTags, priceRange);
    }
  };

  const toggleTag = (tag: string) => {
    const updated = checkedTags.includes(tag)
      ? checkedTags.filter((t) => t !== tag)
      : [...checkedTags, tag];
    updateFilters(checkedCategories, updated, priceRange);
  };

  const toggleAllTags = () => {
    if (!isAllTagsSelected) {
      updateFilters(checkedCategories, [], priceRange);
    }
  };

  const handlePriceChange = (value: number) => {
    updateFilters(checkedCategories, checkedTags, value);
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
                  <motion.label 
                    variants={filterItemVariants}
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isAllCategoriesSelected}
                      onChange={toggleAllCategories}
                      className="rounded border-gray-300 text-[#316312] focus:ring-[#316312] dark:bg-[#121a18] dark:border-gray-600 dark:focus:ring-[#8cc655]"
                    />
                    সকল
                  </motion.label>
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
                  <motion.label 
                    variants={filterItemVariants}
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isAllTagsSelected}
                      onChange={toggleAllTags}
                      className="rounded border-gray-300 text-[#316312] focus:ring-[#316312] dark:bg-[#121a18] dark:border-gray-600 dark:focus:ring-[#8cc655]"
                    />
                    সকল
                  </motion.label>
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
                  value={localPrice}
                  onChange={(e) => setLocalPrice(Number(e.target.value))}
                  onMouseUp={() => handlePriceChange(localPrice)}
                  onTouchEnd={() => handlePriceChange(localPrice)}
                  className="w-full accent-[#316312] dark:accent-[#8cc655] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>৳০</span>
                  <span>৳{localPrice}{localPrice === 1000 ? '+' : ''}</span>
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

const ExploreLayout: React.FC<ExploreLayoutProps> = ({ children }) => {
  return (
    <Suspense fallback={<div className="max-w-[90%] mx-auto mt-10 text-center py-20 text-gray-500 dark:text-gray-400">লোড হচ্ছে...</div>}>
      <ExploreLayoutContent>{children}</ExploreLayoutContent>
    </Suspense>
  );
};

export default ExploreLayout;