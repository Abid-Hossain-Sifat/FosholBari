"use client";

import React, { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import * as Icons from "lucide-react";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const AllOrdersPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  const [activeTab, setActiveTab] = useState("All");

  const allOrders = [
    {
      id: "#FB-8271",
      crop: "বোরো ধান",
      qty: "৫০০ কেজি",
      total: "৳ ২৫,০০০",
      date: "১২ মে, ২০২৬",
      status: "Delivered",
    },
    {
      id: "#FB-8285",
      crop: "কাঁচা মরিচ",
      qty: "৪০ কেজি",
      total: "৳ ৪,৮০০",
      date: "১৪ মে, ২০২৬",
      status: "Processing",
    },
    {
      id: "#FB-8292",
      crop: "আলু (ডায়মন্ড)",
      qty: "২০০ কেজি",
      total: "৳ ৬,০০০",
      date: "১৫ মে, ২০২৬",
      status: "Pending",
    },
    {
      id: "#FB-8310",
      crop: "দেশী পেঁয়াজ",
      qty: "১০০ কেজি",
      total: "৳ ৭,৫০০",
      date: "১৬ মে, ২০২৬",
      status: "Processing",
    },
    {
      id: "#FB-8102",
      crop: "হিমসাগর আম",
      qty: "৮০ কেজি",
      total: "৳ ৮,০০০",
      date: "০৫ মে, ২০২৬",
      status: "Delivered",
    },
  ];

  const filteredOrders =
    activeTab === "All"
      ? allOrders
      : allOrders.filter((order) => order.status === activeTab);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Processing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === "Delivered") return "ডেলিভার্ড";
    if (status === "Processing") return "প্রসেসিং";
    return "পেন্ডিং";
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-3 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${darkMode ? "text-white" : "text-emerald-950"}`}
          >
            আমার সব অর্ডার
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            আপনার কেনা সব ফসলের ইতিহাস ও বর্তমান ডেলিভারি স্ট্যাটাস
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="অর্ডার আইডি দিয়ে খুঁজুন..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl border text-xs outline-none transition-all ${
              darkMode
                ? "bg-[#16201c] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                : "bg-white border-gray-200 focus:border-[#008080]"
            }`}
          />
          <Icons.Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b dark:border-[#2c3d36] border-gray-200 scrollbar-none">
        {[
          { key: "All", label: "সব অর্ডার" },
          { key: "Pending", label: "পেন্ডিং" },
          { key: "Processing", label: "চলমান" },
          { key: "Delivered", label: "ডেলিভার্ড" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? darkMode
                  ? "bg-[#9ece6a]/10 text-[#9ece6a]"
                  : "bg-[#008080] text-white shadow-sm"
                : darkMode
                  ? "text-gray-400 hover:bg-[#16201c]"
                  : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
          darkMode
            ? "bg-[#16201c] border-[#2c3d36]"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr
                className={`text-xs font-bold border-b ${
                  darkMode
                    ? "bg-[#111a17] text-gray-400 border-[#2c3d36]"
                    : "bg-stone-50 text-stone-500 border-gray-200"
                }`}
              >
                <th className="p-4 pl-6">অর্ডার আইডি</th>
                <th className="p-4">ফসলের নাম</th>
                <th className="p-4">পরিমাণ</th>
                <th className="p-4">মোট মূল্য</th>
                <th className="p-4">অর্ডারের তারিখ</th>
                <th className="p-4 text-center">স্ট্যাটাস</th>
                <th className="p-4 pr-6 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y text-xs sm:text-sm ${darkMode ? "divide-[#2c3d36] text-gray-300" : "divide-gray-100 text-stone-700"}`}
            >
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className={`transition-colors ${darkMode ? "hover:bg-[#1B2420]/40" : "hover:bg-stone-50/50"}`}
                  >
                    <td
                      className={`p-4 pl-6 font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                    >
                      {order.id}
                    </td>
                    <td className="p-4 font-semibold">{order.crop}</td>
                    <td className="p-4">{order.qty}</td>
                    <td
                      className={`p-4 font-bold ${darkMode ? "text-gray-200" : "text-emerald-950"}`}
                    >
                      {order.total}
                    </td>
                    <td className="p-4 text-gray-400">{order.date}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusStyles(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <button
                        className={`p-2 rounded-xl border transition-all text-xs font-bold inline-flex items-center gap-1 ${
                          darkMode
                            ? "bg-[#111a17] border-[#2c3d36] hover:bg-[#202f2a] text-gray-300"
                            : "bg-white border-gray-200 hover:bg-stone-100 text-stone-700"
                        }`}
                      >
                        <Icons.Eye className="w-3.5 h-3.5" /> ট্র্যাক করুন
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-400 font-semibold"
                  >
                    এই ক্যাটাগরিতে কোনো অর্ডার পাওয়া যায়নি!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllOrdersPage;