'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ShoppingCart, Star, ShieldCheck, Truck, RefreshCw, ChevronRight, Check, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { exploreProductById, createOrder } from '../../../lib/data';
import { authClient } from '@/lib/auth-client';

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
  farmerId?: string;
  farmerName?: string;
}

const staticFeatures = [
  { icon: ShieldCheck, text: "১০০% অর্গানিক" },
  { icon: Truck, text: "একই দিনে ডেলিভারি" },
  { icon: RefreshCw, text: "ফ্রেশ গ্যারান্টি" }
];

const weightOptionsByUnit: Record<string, string[]> = {
  "প্রতি কেজি": ["২৫০ গ্রাম", "৫০০ গ্রাম", "১ কেজি"],
  "প্রতি লিটার": ["৫০০ মিলি", "১ লিটার", "২ লিটার"],
  "প্রতি বোতল": ["২৫০ মিলি", "৫০০ মিলি", "১ লিটার"],
  "প্রতি আঁটি": ["১ আঁটি", "৩ আঁটি"],
  "প্রতি পিস": ["১ পিস", "২ পিস", "৫ পিস"],
  "প্রতি ডজন": ["৬ পিস", "১২ পিস", "৩০ পিস"],
  "প্রতি বক্স": ["১ বক্স (স্ট্যান্ডার্ড)", "১ লার্জ বক্স"],
  "প্রতি ঝুড়ি": ["১ ঝুড়ি", "২ ঝুড়ি"],
  "প্রতি প্যাকেট": ["১ প্যাকেট", "২ প্যাকেট", "৫ প্যাকেট"],
};

const getWeightOptions = (product: Product): string[] => {
  if (product.weights && product.weights.length > 0) return product.weights;
  return weightOptionsByUnit[product.unit] || [product.unit];
};

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
  const router = useRouter();
  const productId = params.id as string;
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition'>('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      const found = await exploreProductById(productId);

      setProduct(found);
      if (found) {
        const options = getWeightOptions(found);
        setSelectedWeight(options[0]);
      }
      setLoading(false);
    };
    loadProduct();
  }, [productId]);

  const handleBuyNow = async () => {
    if (sessionPending || buying) return;

    if (!session?.user) {
      toast.info("অর্ডার করতে আগে লগইন করুন।");
      router.push("/auth");
      return;
    }

    if (session.user.role !== "Buyer") {
      toast.error("শুধুমাত্র ক্রেতা পণ্য কিনতে পারবেন।");
      return;
    }

    if (!product) return;

    setBuying(true);
    try {
      await createOrder({
        productId: product._id,
        qty: 1,
        weight: selectedWeight || product.unit,
      });
      setJustAdded(true);
      toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে!");
      setTimeout(() => {
        setJustAdded(false);
        router.push("/dashboard/buyer/all-orders");
      }, 1200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "অর্ডার করতে সমস্যা হয়েছে।";
      toast.error(msg);
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f5] dark:bg-[#111a17] text-gray-500 dark:text-gray-400">
        লোড হচ্ছে...
      </div>
    );
  }

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

  const rating = product.rating ?? 0;
  const reviewCount = product.reviewCount ?? 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="min-h-screen w-full bg-[#faf9f5] text-[#1A1A1A] dark:bg-[#111a17] dark:text-[#F8FAFC] py-6 sm:py-10 px-4 sm:px-6 transition-colors duration-300">

      <div className="w-full max-w-[92%] sm:max-w-[88%] md:max-w-[85%] lg:max-w-[80%] mx-auto">

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
                <span className="font-bold text-gray-700 dark:text-gray-200">{rating > 0 ? rating : "নতুন"}</span>
                <span className="text-gray-400 dark:text-gray-500">
                  {reviewCount > 0 ? `(${reviewCount} রিভিউ)` : "(এখনো কোনো রিভিউ নেই)"}
                </span>
              </div>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                  ৳{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-gray-400 line-through">
                    ৳{product.originalPrice}
                  </span>
                )}
              </div>

              {/* Weights */}
              <div className="space-y-2 pt-2">
                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400">কতটুকু কিনবেন:</h4>
                <div className="flex flex-wrap gap-2.5">
                  {getWeightOptions(product).map((weight) => (
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
              <div className="pt-4 space-y-2">
                {!sessionPending && session?.user && session.user.role !== "Buyer" && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    শুধুমাত্র ক্রেতা অ্যাকাউন্ট দিয়ে পণ্য কেনা যায়।
                  </p>
                )}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  disabled={justAdded || buying || (!!session?.user && session.user.role !== "Buyer")}
                  className="w-full flex items-center justify-center gap-2 bg-[#316312] hover:bg-[#254b0e] dark:bg-[#8cc655] dark:hover:bg-[#7bb344] text-white dark:text-[#111a17] font-bold py-3 px-6 rounded-xl shadow-md text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {buying ? (
                      <motion.span
                        key="buying"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 size={18} className="animate-spin" /> অর্ডার হচ্ছে...
                      </motion.span>
                    ) : justAdded ? (
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
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-white dark:bg-[#1a2622] border border-gray-100 dark:border-gray-800 p-2.5 sm:p-3.5 rounded-2xl text-center shadow-sm">
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
                  <p>{product.description || "এই পণ্যের বিস্তারিত বিবরণ এখনো যোগ করা হয়নি।"}</p>
                  {product.bulletPoints && product.bulletPoints.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1.5 font-medium">
                      {product.bulletPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  )}
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