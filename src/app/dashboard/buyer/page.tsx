"use client";

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ShoppingBag, Truck, CreditCard, Bell, Search, ArrowRight } from 'lucide-react';

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const BuyerPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  const recentOrders = [
    { id: '#FB-8271', crop: 'বোরো ধান', qty: '৫০০ কেজি', date: '১২ মে, ২০২৬', status: 'Delivered', statusColor: 'bg-green-500/10 text-green-500 border-green-500/20' },
    { id: '#FB-8285', crop: 'কাঁচা মরিচ', qty: '৪০ কেজি', date: '১৪ মে, ২০২৬', status: 'Processing', statusColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    { id: '#FB-8292', crop: 'আলু (ডায়মন্ড)', qty: '২০০ কেজি', date: '১৫ মে, ২০২৬', status: 'Pending', statusColor: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      {/* Upper Dashboard Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? "text-white" : "text-emerald-950"}`}>ড্যাশবোর্ড ওভারভিউ</h1>
          <p className="text-sm text-gray-400 mt-0.5">আজকের বাজার এবং আপনার অর্ডার ট্র্যাক করুন</p>
        </div>
      </div>

      {/* Metrics Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Metric Card 1 */}
        <div className={`p-6 rounded-2xl border shadow-sm flex items-start justify-between transition-colors ${
          darkMode ? "bg-[#16201c] border-[#2c3d36]" : "bg-white border-gray-200"
        }`}>
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-semibold text-gray-400 block">মোট অর্ডার</span>
            <h3 className={`text-3xl sm:text-4xl font-black ${darkMode ? "text-white" : "text-emerald-950"}`}>৪২ টি</h3>
            <span className={`text-xs font-semibold ${darkMode ? "text-[#9ece6a]" : "text-[#008080]"}`}>↗ গত মাসে +১২% বৃদ্ধি</span>
          </div>
          <div className={`p-3 rounded-xl ${darkMode ? "bg-[#8cc655]/10 text-[#8cc655]" : "bg-[#008080]/10 text-[#008080]"}`}>
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className={`p-6 rounded-2xl border shadow-sm flex items-start justify-between transition-colors ${
          darkMode ? "bg-[#16201c] border-[#2c3d36]" : "bg-white border-gray-200"
        }`}>
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-semibold text-gray-400 block">চলমান ডেলিভারি</span>
            <h3 className={`text-3xl sm:text-4xl font-black ${darkMode ? "text-white" : "text-emerald-950"}`}>০৮ টি</h3>
            <span className="text-xs text-gray-400 block">ডেলিভারি ট্র্যাকিং এ আছে</span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className={`p-6 rounded-2xl border shadow-sm flex items-start justify-between sm:col-span-2 lg:col-span-1 transition-colors ${
          darkMode ? "bg-[#16201c] border-[#2c3d36]" : "bg-white border-gray-200"
        }`}>
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-semibold text-gray-400 block">মোট খরচ</span>
            <h3 className={`text-3xl sm:text-4xl font-black ${darkMode ? "text-white" : "text-emerald-950"}`}>৳ ৮৫,৪২০</h3>
            <span className="text-xs text-gray-400 block">বিগত ৩০ দিনের হিসেব</span>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Orders Responsive Data Sheet */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
        darkMode ? "bg-[#16201c] border-[#2c3d36]" : "bg-white border-gray-200"
      }`}>
        <div className="p-5 sm:p-6 flex items-center justify-between border-b border-gray-200 dark:border-[#2c3d36]">
          <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? "text-white" : "text-emerald-950"}`}>সাম্প্রতিক অর্ডার সমূহ</h2>
          <Link href="/dashboard/buyer/orders" className={`text-sm font-bold flex items-center gap-1 transition-colors ${
            darkMode ? "text-[#9ece6a] hover:text-[#9ece6a]/80" : "text-[#008080] hover:text-emerald-700"
          }`}>
            সবগুলো দেখুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Responsive Table wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className={`text-xs font-bold border-b ${
                darkMode ? "bg-[#111a17] text-gray-400 border-[#2c3d36]" : "bg-stone-50 text-stone-500 border-gray-200"
              }`}>
                <th className="p-4 pl-6">অর্ডার আইডি</th>
                <th className="p-4">ফসল</th>
                <th className="p-4">পরিমাণ</th>
                <th className="p-4">তারিখ</th>
                <th className="p-4 pr-6 text-center">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className={`divide-y text-xs sm:text-sm ${darkMode ? "divide-[#2c3d36] text-gray-300" : "divide-gray-100 text-stone-700"}`}>
              {recentOrders.map((order) => (
                <tr key={order.id} className={`transition-colors ${darkMode ? "hover:bg-[#1B2420]/40" : "hover:bg-stone-50/50"}`}>
                  <td className={`p-4 pl-6 font-bold ${darkMode ? "text-white" : "text-stone-900"}`}>{order.id}</td>
                  <td className="p-4 font-semibold">{order.crop}</td>
                  <td className="p-4">{order.qty}</td>
                  <td className="p-4 text-gray-400">{order.date}</td>
                  <td className="p-4 pr-6 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${order.statusColor}`}>
                      {order.status === "Delivered" ? "ডেলিভার্ড" : order.status === "Processing" ? "প্রসেসিং" : "পেন্ডিং"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BuyerPage;