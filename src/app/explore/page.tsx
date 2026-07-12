'use client'
import React from 'react';
import { ShoppingCart, ChevronDown, ChevronDown as SortIcon } from 'lucide-react';

// Interface for Product Data
interface Product {
  id: number;
  tag: string;
  name: string;
  unit: string;
  price: number;
  image: string;
  badge?: { text: string; type: 'new' | 'limited' };
}

// Dummy Data
const dummyProducts: Product[] = [
  { id: 1, tag: 'টাটকা', name: 'মিশ্র সবজি ঝুড়ি', unit: 'প্রতি কেজি', price: 180, image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500', badge: { text: 'নতুন', type: 'new' } },
  { id: 2, tag: 'সিজনাল', name: 'সিজনাল ফলের ঝুড়ি', unit: 'প্রতি কেজি', price: 350, image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=500' },
  { id: 3, tag: 'খাঁটি', name: 'বিস্তৃত ঘি জার', unit: 'প্রতি লিটার', price: 90, image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500' },
  { id: 4, tag: 'অর্গানিক', name: 'অর্গানিক লাল চাল', unit: 'প্রতি কেজি', price: 120, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500' },
  { id: 5, tag: 'তাজা', name: 'তাজা পালং শাক', unit: 'প্রতি আঁটি', price: 30, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500', badge: { text: 'সীমিত স্টক', type: 'limited' } },
  { id: 6, tag: 'প্রিমিয়াম', name: 'প্রিমিয়াম ফলের বক্স', unit: 'প্রতি বক্স', price: 450, image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500' },
];

const ExplorePage: React.FC = () => {
  return (
    <>
      {/* Top Banner section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#316312] dark:text-[#8cc655]">তাজা পণ্যসমূহ</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{dummyProducts.length}টি পণ্য পাওয়া গেছে</p>
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full sm:w-auto">
          <select className="appearance-none w-full sm:w-auto bg-white dark:bg-[#1a2622] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 pl-4 pr-9 py-2 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655]">
            <option>নতুন অর্ডার</option>
            <option>মূল্য: কম থেকে বেশি</option>
            <option>মূল্য: বেশি থেকে কম</option>
          </select>
          <SortIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {dummyProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-[#1a2622] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-300 group"
          >
            {/* Image & Badge */}
            <div className="relative aspect-[4/3] bg-gray-50 dark:bg-[#111a17] overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.badge && (
                <span
                  className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-medium ${
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
              <h3 className="font-bold text-sm sm:text-base text-[#254b0e] dark:text-gray-100 mt-0.5">{product.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.unit}</p>

              <div className="flex items-center justify-between mt-3 gap-2">
                <span className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white">
                  ৳{product.price}
                </span>

                {/* Add to Cart Button */}
                <button className="flex items-center gap-1.5 bg-[#316312] hover:bg-[#254b0e] dark:bg-[#8cc655] dark:hover:bg-[#7bb344] text-white dark:text-[#111a17] text-xs font-semibold px-3 py-2 rounded-full transition-colors duration-200 whitespace-nowrap">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center mt-12">
        <button className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2622] text-gray-700 dark:text-gray-200 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          আরও দেখুন <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </>
  );
};

export default ExplorePage;