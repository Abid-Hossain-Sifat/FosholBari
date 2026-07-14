"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Thermometer, Leaf, BadgeCheck } from "lucide-react";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface TrustItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const trustItems: TrustItem[] = [
  {
    icon: Thermometer,
    title: "নিয়ন্ত্রিত তাপমাত্রা",
    description: "পণ্য সতেজ রাখতে অত্যাধুনিক কোল্ড চেইন প্রযুক্তি।",
  },
  {
    icon: Leaf,
    title: "স্বাস্থ্যসম্মত প্যাকেজিং",
    description: "সম্পূর্ণ পরিবেশবান্ধব ও জীবাণুমুক্ত উপায়ে প্যাকেজিং।",
  },
  {
    icon: BadgeCheck,
    title: "যাচাইকৃত খামার",
    description: "সরাসরি আমাদের তত্ত্বাবধানে পরিচালিত সেরা খামারসমূহ।",
  },
];

const Trust = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  return (
    <div
      className={`w-full py-8 transition-colors duration-300 ${
        darkMode ? "bg-[#1B2420]" : "bg-[#faf9f5]"
      }`}
    >
      <div className="max-w-[90%] lg:max-w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {trustItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.15, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className={`flex flex-col items-center text-center gap-3 rounded-2xl border px-6 py-8 cursor-pointer transition-colors duration-300 ${
                darkMode
                  ? "bg-[#16201c] border-[#26332d] hover:border-[#9ece6a]/50 hover:bg-[#1b2620]"
                  : "bg-white border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
              }`}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                transition={{ duration: 0.5 }}
                className={`flex-shrink-0 p-3 rounded-full ${
                  darkMode ? "bg-[#9ece6a]/10" : "bg-emerald-100"
                }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    darkMode ? "text-[#9ece6a]" : "text-emerald-700"
                  }`}
                />
              </motion.div>

              <h3
                className={`text-base font-bold ${
                  darkMode ? "text-gray-100" : "text-emerald-950"
                }`}
              >
                {item.title}
              </h3>

              <p
                className={`text-sm leading-relaxed ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Trust;