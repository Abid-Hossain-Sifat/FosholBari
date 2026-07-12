'use client'
import React, { useState, useEffect } from 'react';

interface ExploreLayoutProps {
  children: React.ReactNode;
}

const categories = ['শাক-সবজি', 'ফলমূল', 'দুগ্ধজাত পণ্য', 'মাংসজাত পণ্য'];
const tags = ['টাটকা', 'সিজনাল', 'খাঁটি', 'অর্গানিক', 'তাজা', 'প্রিমিয়াম'];

const ExploreLayout: React.FC<ExploreLayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [checkedCategories, setCheckedCategories] = useState<string[]>(['শাক-সবজি']);
  const [checkedTags, setCheckedTags] = useState<string[]>([]);
  const [organicOnly, setOrganicOnly] = useState<boolean>(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

  return (
    <div className="min-h-screen w-full bg-[#faf9f5] text-[#1A1A1A] dark:bg-[#111a17] dark:text-[#F8FAFC] transition-colors duration-300">
      <main className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

          {/* Sidebar Filters (title sits above the box, mirroring the page header) */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#316312] dark:text-[#8cc655]">ফিল্টার</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">আপনার প্রয়োজন অনুযায়ী বাছাই করুন</p>
            </div>

            <aside className="bg-white dark:bg-[#1a2622] p-5 sm:p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
            {/* Category */}
            <div className="mb-6">
              <h4 className="text-sm font-bold mb-3 text-[#316312] dark:text-[#8cc655]">ক্যাটাগরি</h4>
              <div className="space-y-2.5">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="rounded border-gray-300 text-[#316312] focus:ring-[#316312] dark:bg-[#121a18] dark:border-gray-600 dark:focus:ring-[#8cc655]"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-bold mb-3 text-[#316312] dark:text-[#8cc655]">ট্যাগ</h4>
              <div className="space-y-2.5">
                {tags.map((tag) => (
                  <label key={tag} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedTags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                      className="rounded border-gray-300 text-[#316312] focus:ring-[#316312] dark:bg-[#121a18] dark:border-gray-600 dark:focus:ring-[#8cc655]"
                    />
                    {tag}
                  </label>
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
                className="w-full accent-[#316312] dark:accent-[#8cc655]"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>৳০</span>
                <span>৳{priceRange}{priceRange === 1000 ? '+' : ''}</span>
              </div>
            </div>
            </aside>
          </div>

          {/* Page content (header + product grid) */}
          <div className="lg:col-span-3">
            {children}
          </div>

        </div>
      </main>
    </div>
  );
};

export default ExploreLayout;