"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { 
  TrendingUp, 
  ShoppingBag, 
  Leaf, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface Order {
  id: string;
  buyer: string;
  product: string;
  qty: string;
  total: string;
  status: "Delivered" | "Pending";
}

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const recentOrders: Order[] = [
  { id: "#ORD-9023", buyer: "মইনুল ইসলাম", product: "প্রিমিয়াম মিনিকেট চাল", qty: "৫০ কেজি", total: "৳৩,৫০০", status: "Delivered" },
  { id: "#ORD-9024", buyer: "আনিকা রহমান", product: "অর্গানিক টমেটো", qty: "১২ কেজি", total: "৳১,৪৪০", status: "Pending" },
  { id: "#ORD-9025", buyer: "তামিম ইকবাল", product: "আম্রপালি আম", qty: "২০ কেজি", total: "৳৪,০০০", status: "Delivered" },
  { id: "#ORD-9026", buyer: "সুজন আহমেদ", product: "দেশী পেঁয়াজ", qty: "৪০ কেজি", total: "৳২,৮০০", status: "Pending" },
  { id: "#ORD-9027", buyer: "নাবিলা হাসান", product: "কাঁচা মরিচ", qty: "৫ কেজি", total: "৳৭৫০", status: "Delivered" },
];

const FarmerPage: React.FC = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  return (
    <div className="space-y-6">
      {/* Header Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          স্বাগতম, আবিদ হোসেন সিফাত! 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          আজকে আপনার খামারের পণ্য এবং অর্ডারের সংক্ষিপ্ত বিবরণ।
        </p>
      </div>

      {/* --- Top Summary Cards Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Revenue */}
        <div className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
          darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">মোট উপার্জন</p>
              <h3 className="text-2xl font-bold mt-2">৳৪৫,২০০</h3>
            </div>
            <div className={`p-3 rounded-xl text-white ${darkMode ? "bg-[#8cc655]/20 text-[#9ece6a]" : "bg-[#316312] text-white"}`}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-xs text-emerald-600 dark:text-[#9ece6a] font-medium">
            <ArrowUpRight size={14} />
            <span>গত মাসের তুলনায় +১২.৫% বৃদ্ধি</span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
          darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">মোট অর্ডার</p>
              <h3 className="text-2xl font-bold mt-2">১৮০ টি</h3>
            </div>
            <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-xs text-gray-400">
            <span>সকল তালিকাভুক্ত ফসলের উপর</span>
          </div>
        </div>

        {/* Card 3: Active Crops */}
        <div className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
          darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 font-bangla">সক্রিয় ফসল</p>
              <h3 className="text-2xl font-bold mt-2">১৪ টি</h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-[#316312]/10 text-emerald-800 dark:text-[#9ece6a]">
              <Leaf size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-xs text-gray-400">
            <span>৪টি ফসল স্টকের বাইরে আছে</span>
          </div>
        </div>

        {/* Card 4: Pending Deliveries */}
        <div className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
          darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">পেন্ডিং ডেলিভারি</p>
              <h3 className="text-2xl font-bold mt-2">০৫ টি</h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-500">
              <Clock size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-xs text-amber-500 font-semibold">
            <span>দ্রুত প্যাকেজিং করা প্রয়োজন</span>
          </div>
        </div>

      </div>

      {/* --- Sales Analytics & Breakdown Graph --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Graph (2/3 width) */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"
        } lg:col-span-2`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg">বিক্রয়ের বিশ্লেষণ</h3>
              <p className="text-xs text-gray-400">মাসিক ফসলের আয়ের ট্র্যাকিং</p>
            </div>
            <select className="px-3 py-1.5 text-xs font-semibold rounded-lg border bg-gray-50 dark:bg-gray-800 border-inherit focus:outline-none dark:text-gray-200 cursor-pointer">
              <option>চলতি মাস</option>
              <option>গত ৩ মাস</option>
              <option>বার্ষিক</option>
            </select>
          </div>
          
          <div className="h-64 flex flex-col justify-end overflow-x-auto">
            <div className="flex items-end justify-between h-48 px-1 sm:px-2 gap-1 sm:gap-2 md:gap-4 min-w-[520px] sm:min-w-0">
              {[40, 25, 60, 45, 85, 55, 95, 70, 65, 80, 50, 90].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end min-w-0">
                  <div 
                    style={{ height: `${val}%` }} 
                    className={`w-full rounded-t-md transition-colors duration-200 ${
                      darkMode 
                        ? "bg-gradient-to-t from-[#8cc655]/20 to-[#8cc655] group-hover:to-teal-500" 
                        : "bg-gradient-to-t from-emerald-850/30 to-[#316312] group-hover:to-emerald-500"
                    }`}
                  />
                  <span className={`text-[8px] sm:text-[10px] text-gray-400 mt-2 select-none text-center leading-tight ${idx % 2 !== 0 ? "hidden sm:inline" : ""}`}>
                    {["জানু", "ফেব্রু", "মার্চ", "এপ্রি", "মে", "জুন", "জুলা", "আগ", "সেপ্টে", "অক্টো", "নভে", "ডিসে"][idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Breakdown (1/3 width) */}
        <div className={`p-5 rounded-2xl border ${
          darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"
        } flex flex-col justify-between`}>
          <div>
            <h3 className="font-bold text-lg mb-1">জনপ্রিয় ক্যাটাগরি</h3>
            <p className="text-xs text-gray-400 mb-6">এই মরসুমে সবচেয়ে বেশি বিক্রি হওয়া ফসল</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>প্রিমিয়াম চাল</span>
                  <span>৫২%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className={`h-full rounded-full ${darkMode ? "bg-[#8cc655]" : "bg-[#316312]"}`} style={{ width: "52%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>অর্গানিক সবজি</span>
                  <span>২৮%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full" style={{ width: "28%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>মরসুমী ফল</span>
                  <span>২০%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "20%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 mt-4 border border-dashed border-gray-200 dark:border-gray-800">
            <span className="text-xs font-semibold text-gray-400 block mb-1">কৃষি পরামর্শ:</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              বাজারে এখন <strong className="text-emerald-700 dark:text-[#9ece6a]">অর্গানিক সবজির</strong> ব্যাপক চাহিদা। আপনার স্টকে আরো সবজি যুক্ত করতে পারেন!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FarmerPage;