'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { motion, Variants } from 'framer-motion';
import { ShoppingCart, ChevronDown as SortIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { exploreCollection } from '../../../lib/data';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

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

const ExplorePageContent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const categoriesParam = searchParams.get('categories');
      const categories = categoriesParam
        ? categoriesParam.split(',').filter(Boolean)
        : undefined;

      const tagsParam = searchParams.get('tags');
      const tags = tagsParam ? tagsParam.split(',').filter(Boolean) : undefined;

      const priceParam = searchParams.get('maxPrice');
      const maxPrice = priceParam ? Number(priceParam) : undefined;

      const sortParam = searchParams.get('sort') || undefined;
      const pageParam = searchParams.get('page');
      const page = pageParam ? Number(pageParam) : 1;

      try {
        const json = await exploreCollection({ categories, tags, maxPrice, sort: sortParam, page });
        setProducts(json.data || []);
        setTotalCount(json.totalCount || 0);
        setTotalPages(json.totalPages || 1);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [searchParams]);

  const currentPage = Number(searchParams.get('page') || '1');
  const sortParam = searchParams.get('sort') || 'newest';

  const getSelectValue = () => {
    if (sortParam === 'price-asc') return 'মূল্য: কম থেকে বেশি';
    if (sortParam === 'price-desc') return 'মূল্য: বেশি থেকে কম';
    return 'নতুন অর্ডার';
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    let mapped = 'newest';
    if (val === 'মূল্য: কম থেকে বেশি') mapped = 'price-asc';
    if (val === 'মূল্য: বেশি থেকে কম') mapped = 'price-desc';

    const params = new URLSearchParams(searchParams.toString());
    if (mapped !== 'newest') {
      params.set('sort', mapped);
    } else {
      params.delete('sort');
    }
    // reset to page 1 on sort change
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-[#1a2622] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
            <div className="aspect-[4/3] bg-gray-100 dark:bg-[#111a17]" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Top Banner section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#316312] dark:text-[#8cc655]">তাজা পণ্যসমূহ</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {totalCount}টি পণ্য পাওয়া গেছে
            {totalPages > 1 && (
              <span className="ml-2 text-[#316312] dark:text-[#8cc655] font-medium">
                (পেজ {currentPage}/{totalPages})
              </span>
            )}
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full sm:w-auto">
          <select
            value={getSelectValue()}
            onChange={handleSortChange}
            className="appearance-none w-full sm:w-auto bg-white dark:bg-[#1a2622] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 pl-4 pr-9 py-2 rounded-full text-sm outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] cursor-pointer"
          >
            <option>নতুন অর্ডার</option>
            <option>মূল্য: কম থেকে বেশি</option>
            <option>মূল্য: বেশি থেকে কম</option>
          </select>
          <SortIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Product Cards Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          <p className="text-lg">কোনো পণ্য পাওয়া যায়নি</p>
          <p className="text-sm mt-1">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন</p>
        </div>
      ) : (
        <motion.div
          key={`page-${currentPage}`}
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
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
          {/* Prev */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2622] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" /> আগে
          </motion.button>

          {/* Page Numbers */}
          {getPageNumbers().map((p, i) =>
            p === '...' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400 select-none">…</span>
            ) : (
              <motion.button
                key={p}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(p as number)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold border transition-all shadow-sm ${
                  p === currentPage
                    ? 'bg-[#316312] dark:bg-[#8cc655] text-white dark:text-[#111a17] border-[#316312] dark:border-[#8cc655] shadow-md'
                    : 'bg-white dark:bg-[#1a2622] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {p}
              </motion.button>
            )
          )}

          {/* Next */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a2622] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            পরে <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      )}
    </div>
  );
};

const ExplorePage = () => {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-[#1a2622] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
            <div className="aspect-[4/3] bg-gray-100 dark:bg-[#111a17]" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    }>
      <ExplorePageContent />
    </Suspense>
  );
};

export default ExplorePage;