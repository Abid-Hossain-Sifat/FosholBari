"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface ReviewItem {
  quote: string;
  name: string;
  location: string;
  avatarColor: string; // tailwind bg class
}

// TODO: Replace with real data from API/database later
const reviews: ReviewItem[] = [
  {
    quote:
      "আমি নিয়মিত এখান থেকে সবজি কিনি। সবসময় একদম টাটকা সবজি পাওয়া যায় এবং ডেলিভারিও খুব দ্রুত হয়। বাজারের ঝামেলা এখন নেই বললেই চলে।",
    name: "আরিফ আহমেদ",
    location: "বনানী, ঢাকা",
    avatarColor: "bg-sky-500",
  },
  {
    quote:
      "খাঁটি মধু এবং ঘি এর জন্য ফসলবাড়ি সেরা। পণ্যের মান নিয়ে আমার কখনো সন্দেহ জাগেনি। প্যাকিং অনেক ভালো ছিল।",
    name: "নুসরাত জাহান",
    location: "ধানমন্ডি, ঢাকা",
    avatarColor: "bg-pink-400",
  },
  {
    quote:
      "মাছ এবং মাংস একদম ফ্রেশ থাকে। বিশেষ করে ইলিশ মাছের কোয়ালিটি অনেক ভালো পেয়েছি। ধন্যবাদ ফসলবাড়ি।",
    name: "সাজ্জাদ হোসেন",
    location: "উত্তরা, ঢাকা",
    avatarColor: "bg-emerald-500",
  },
];

const getInitial = (name: string) => name.trim().charAt(0);

const Review = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  return (
    <div
      className={`w-full py-12 transition-colors duration-300 ${
        darkMode ? "bg-[#1B2420]" : "bg-[#faf9f5]"
      }`}
    >
      <div className="max-w-[92%] sm:max-w-[88%] md:max-w-[85%] lg:max-w-[80%] mx-auto flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`text-2xl sm:text-3xl font-bold text-center mb-10 ${
            darkMode ? "text-[#9ece6a]" : "text-emerald-800"
          }`}
        >
          ক্রেতারা যা বলছেন
        </motion.h2>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.15, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className={`relative flex flex-col justify-between rounded-2xl border p-6 cursor-pointer transition-colors duration-300 ${
                darkMode
                  ? "bg-[#16201c] border-[#26332d] hover:border-[#9ece6a]/50"
                  : "bg-white border-gray-200 hover:border-emerald-300"
              }`}
            >
              {/* Quote icon */}
              <Quote
                className={`absolute top-5 right-5 w-8 h-8 ${
                  darkMode ? "text-[#9ece6a]/20" : "text-emerald-800/10"
                }`}
                fill="currentColor"
              />

              {/* Quote text */}
              <p
                className={`text-sm leading-relaxed mb-6 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                &ldquo;{review.quote}&rdquo;
              </p>

              {/* Divider */}
              <div
                className={`h-px mb-4 ${
                  darkMode ? "bg-[#26332d]" : "bg-gray-200"
                }`}
              />

              {/* Reviewer info */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-sm flex-shrink-0 ${review.avatarColor}`}
                >
                  {getInitial(review.name)}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-sm font-bold ${
                      darkMode ? "text-gray-100" : "text-emerald-950"
                    }`}
                  >
                    {review.name}
                  </span>
                  <span
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {review.location}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;