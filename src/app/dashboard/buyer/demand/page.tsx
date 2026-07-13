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

const DemandPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  const myDemands = [
    {
      id: "DM-9021",
      crop: "দেশী পেঁয়াজ",
      qty: "১২০০ কেজি",
      budget: "৳ ৫০,০০০",
      date: "২০ মে, ২০২৬",
      responses: 5,
      status: "Active",
    },
    {
      id: "DM-8843",
      crop: "কাটিনাল আলু",
      qty: "২০০০ কেজি",
      budget: "৳ ৩৫,০০০",
      date: "২৫ মে, ২০২৬",
      responses: 12,
      status: "Completed",
    },
    {
      id: "DM-9104",
      crop: "হিমসাগর আম",
      qty: "৫০০ কেজি",
      budget: "৳ ৪৫,০০০",
      date: "০২ জুন, ২০২৬",
      responses: 0,
      status: "Pending",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-3 sm:px-0">
      <div>
        <h1
          className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${darkMode ? "text-white" : "text-emerald-950"}`}
        >
          ফসলের চাহিদা পোস্ট
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
          আপনার প্রয়োজনীয় ফসলের চাহিদা দিন এবং কৃষকদের অফার গ্রহণ করুন
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        <div
          className={`p-4 sm:p-6 rounded-2xl border shadow-sm lg:col-span-1 ${
            darkMode
              ? "bg-[#16201c] border-[#2c3d36]"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-base sm:text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-emerald-950"}`}
          >
            <Icons.PlusCircle className="w-5 h-5 text-[#008080] dark:text-[#9ece6a]" />
            নতুন চাহিদা তৈরি করুন
          </h2>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                ফসলের নাম
              </label>
              <input
                type="text"
                placeholder="উদা: বোরো ধান, আলু, পেঁয়াজ"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  darkMode
                    ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                    : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">
                  পরিমাণ (কেজি/মণ)
                </label>
                <input
                  type="text"
                  placeholder="উদা: ৫০০ কেজি"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    darkMode
                      ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                      : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                  }`}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">
                  আনুমানিক বাজেট (৳)
                </label>
                <input
                  type="number"
                  placeholder="উদা: ২০০০০"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    darkMode
                      ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                      : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                কবে নাগাদ প্রয়োজন?
              </label>
              <input
                type="date"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  darkMode
                    ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                    : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                অতিরিক্ত বিবরণ (অপশনাল)
              </label>
              <textarea
                rows={3}
                placeholder="ফসলের মান বা বিশেষ কোনো শর্ত থাকলে লিখুন..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none ${
                  darkMode
                    ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                    : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                }`}
              />
            </div>

            <button
              className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all ${
                darkMode
                  ? "bg-[#9ece6a] text-black hover:bg-[#8cc655]"
                  : "bg-[#008080] text-white hover:bg-emerald-700"
              }`}
            >
              চাহিদা পোস্ট করুন
            </button>
          </form>
        </div>

        <div
          className={`p-4 sm:p-6 rounded-2xl border shadow-sm lg:col-span-2 ${
            darkMode
              ? "bg-[#16201c] border-[#2c3d36]"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-base sm:text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-emerald-950"}`}
          >
            <Icons.History className="w-5 h-5 text-[#008080] dark:text-[#9ece6a]" />
            আপনার সাম্প্রতিক চাহিদাসমূহ
          </h2>

          <div className="space-y-4">
            {myDemands.map((demand) => (
              <div
                key={demand.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${
                  darkMode
                    ? "bg-[#111a17] border-[#2c3d36] hover:bg-[#16201c]"
                    : "bg-stone-50 border-gray-100 hover:bg-stone-100/50"
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`font-bold text-sm sm:text-base ${darkMode ? "text-white" : "text-emerald-950"}`}
                    >
                      {demand.crop}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${
                        demand.status === "Active"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : demand.status === "Completed"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      }`}
                    >
                      {demand.status === "Active"
                        ? "চলতি"
                        : demand.status === "Completed"
                          ? "সম্পন্ন"
                          : "অপেক্ষমাণ"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 break-words">
                    আইডি: <span className="font-semibold">{demand.id}</span> •
                    পরিমাণ:{" "}
                    <span className="font-semibold">{demand.qty}</span> •
                    বাজেট:{" "}
                    <span className="font-semibold">{demand.budget}</span>
                  </p>
                  <p className="text-[11px] text-gray-500 flex items-center gap-1">
                    <Icons.Calendar className="w-3 h-3" /> শেষ সময়:{" "}
                    {demand.date}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-200 dark:border-[#2c3d36]">
                  <div className="text-left sm:text-right">
                    <span
                      className={`text-xs font-bold block ${demand.responses > 0 ? "text-orange-500" : "text-gray-400"}`}
                    >
                      {demand.responses} টি অফার এসেছে
                    </span>
                  </div>
                  <button
                    className={`p-2 rounded-lg border transition-all text-xs font-bold flex items-center gap-1 shrink-0 ${
                      darkMode
                        ? "bg-[#16201c] border-[#2c3d36] hover:bg-[#202f2a] text-gray-200"
                        : "bg-white border-gray-200 hover:bg-stone-100 text-stone-700"
                    }`}
                  >
                    বিস্তারিত <Icons.ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandPage;