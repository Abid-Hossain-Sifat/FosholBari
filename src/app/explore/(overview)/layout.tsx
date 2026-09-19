'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { motion, Variants } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, RotateCcw } from 'lucide-react';
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
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
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

  const activeFilterCount = 
    (checkedCategories.length > 0 ? 1 : 0) + 
    (checkedTags.length > 0 ? 1 : 0) + 
    (priceRange < 1000 ? 1 : 0);

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

  const resetAllFilters = () => {
    setLocalPrice(1000);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('categories');
    params.delete('tags');
    params.delete('maxPrice');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePriceChange = (value: number) => {
    updateFilters(checkedCategories, checkedTags, value);
  };

  const sidebarVariants: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.5, ease: 'easeOut' } 
    }
  };

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: 'easeOut', delay: 0.1 } 
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#faf9f5] text-[#1A1A1A] dark:bg-[#111a17] dark:text-[#F8FAFC] transition-colors duration-300">
      <main className="w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        {/* Mobile Filter Toggle Button Bar */}
        <div className="lg:hidden mb-6 flex items-center justify-between gap-3 bg-white dark:bg-[#1a2622] p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 text-sm font-bold text-[#316312] dark:text-[#8cc655] min-h-[44px] px-2"
            aria-expanded={mobileFilterOpen}
            aria-controls="mobile-filter-drawer"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>ফিল্টার বাছাই করুন</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 text-xs font-extrabold bg-[#316312] text-white dark:bg-[#8cc655] dark:text-[#111a17] rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 min-h-[44px] px-3 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar Filters */}
          <motion.div 
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            className="lg:sticky lg:top-8 h-fit"
          >
            {/* Desktop Filter Heading */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-[#316312] dark:text-[#8cc655]">ফিল্টার</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">আপনার প্রয়োজন অনুযায়ী বাছাই করুন</p>
              </div>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 hover:underline transition-colors"
                  title="সব ফিল্টার মুছুন"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>রিসেট</span>
                </button>
              )}
            </div>

            {/* Filter Content (Collapsible on mobile, always visible on desktop) */}
            <div 
              id="mobile-filter-drawer"
              className={`${mobileFilterOpen ? 'block' : 'hidden'} lg:block`}
            >
              <aside className="bg-white dark:bg-[#1a2622] p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                {/* Category */}
                <div className="mb-6">
                  <label htmlFor="category-select" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#316312] dark:text-[#8cc655]">
                    ক্যাটাগরি
                  </label>
                  <div className="relative">
                    <select
                      id="category-select"
                      aria-label="ক্যাটাগরি নির্বাচন করুন"
                      value={isAllCategoriesSelected ? '' : checkedCategories[0] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateFilters(val ? [val] : [], checkedTags, priceRange);
                      }}
                      className="appearance-none w-full bg-white dark:bg-[#121a18] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 pl-3.5 pr-8 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] cursor-pointer"
                    >
                      <option value="">সকল ক্যাটাগরি</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6 pt-5 border-t border-gray-100 dark:border-gray-800">
                  <label htmlFor="tags-select" className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#316312] dark:text-[#8cc655]">
                    ট্যাগ
                  </label>
                  <div className="relative">
                    <select
                      id="tags-select"
                      aria-label="ট্যাগ নির্বাচন করুন"
                      value={isAllTagsSelected ? '' : checkedTags[0] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        updateFilters(checkedCategories, val ? [val] : [], priceRange);
                      }}
                      className="appearance-none w-full bg-white dark:bg-[#121a18] border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 pl-3.5 pr-8 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] cursor-pointer"
                    >
                      <option value="">সকল ট্যাগ</option>
                      {tags.map((tag) => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Price Range */}
                <div className="pt-5 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="price-slider" className="text-xs font-bold uppercase tracking-wider text-[#316312] dark:text-[#8cc655]">
                      মূল্য সীমা
                    </label>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      সর্বোচ্চ ৳{localPrice}{localPrice === 1000 ? '+' : ''}
                    </span>
                  </div>
                  <input
                    id="price-slider"
                    aria-label="সর্বোচ্চ মূল্য নির্বাচন করুন"
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={localPrice}
                    onChange={(e) => setLocalPrice(Number(e.target.value))}
                    onMouseUp={() => handlePriceChange(localPrice)}
                    onTouchEnd={() => handlePriceChange(localPrice)}
                    className="w-full accent-[#316312] dark:accent-[#8cc655] cursor-pointer h-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
                    <span>৳০</span>
                    <span>৳১০০০+</span>
                  </div>
                </div>

                {/* Clear Filters Button inside aside for mobile */}
                {activeFilterCount > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 lg:hidden">
                    <button
                      type="button"
                      onClick={() => {
                        resetAllFilters();
                        setMobileFilterOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>সব ফিল্টার মুছুন ({activeFilterCount})</span>
                    </button>
                  </div>
                )}
              </aside>
            </div>
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

import { HarvestLoader } from "@/Components/loading";

const ExploreLayout: React.FC<ExploreLayoutProps> = ({ children }) => {
  return (
    <Suspense fallback={<HarvestLoader variant="fallback" className="min-h-[400px]" />}>
      <ExploreLayoutContent>{children}</ExploreLayoutContent>
    </Suspense>
  );
};

export default ExploreLayout;