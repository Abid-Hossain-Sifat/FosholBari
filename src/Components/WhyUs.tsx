"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Truck, Undo2, Tractor } from "lucide-react";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface WhyUsItem {
  icon: React.ElementType;
  title: string;
  description: string;
}

const whyUsItems: WhyUsItem[] = [
  {
    icon: Truck,
    title: "একই দিনে ডেলিভারি",
    description:
      "আপনার অর্ডার করার কয়েক ঘণ্টার মধ্যেই পণ্য পৌঁছে যাবে আপনার হাতে।",
  },
  {
    icon: Undo2,
    title: "সহজ রিটার্ন পলিসি",
    description:
      "পণ্য পছন্দ না হলে বা কোনো সমস্যা থাকলে কোনো প্রশ্ন ছাড়াই রিটার্ন গ্রহণ।",
  },
  {
    icon: Tractor,
    title: "সরাসরি খামার থেকে সংগ্রহ",
    description:
      "মাঝারি কোনো ভয় নেই, কৃষকের ফসল সরাসরি চলে আসে আপনার টেবিলে।",
  },
];

const WhyUs = () => {
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
          কেন আমাদের বেছে নেবেন
        </motion.h2>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {whyUsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.15, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center text-center gap-3 cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotate: [0, -8, 8, -4, 0] }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center w-14 h-14 rounded-full shadow-sm bg-[#316312]"
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>

                <h3
                  className={`text-base font-bold ${
                    darkMode ? "text-gray-100" : "text-emerald-950"
                  }`}
                >
                  {item.title}
                </h3>

                <p
                  className={`text-sm leading-relaxed max-w-xs ${
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
    </div>
  );
};

export default WhyUs;