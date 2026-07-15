"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { MousePointerClick, PackageCheck, Home } from "lucide-react";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface Step {
  number: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
}

const steps: Step[] = [
  {
    number: "১",
    icon: MousePointerClick,
    title: "অর্ডার করুন",
    subtitle: "পণ্য বেছে নিন",
  },
  {
    number: "২",
    icon: PackageCheck,
    title: "খামার থেকে সংগ্রহ",
    subtitle: "টাটকা ফসল প্রস্তুত",
  },
  {
    number: "৩",
    icon: Home,
    title: "বাসায় পৌঁছে যাবে",
    subtitle: "দ্রুত ডেলিভারি",
  },
];

const HowWork = () => {
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
          className={`text-2xl sm:text-3xl font-bold text-center mb-14 ${
            darkMode ? "text-[#9ece6a]" : "text-emerald-800"
          }`}
        >
          কিভাবে কাজ করে
        </motion.h2>

        <div className="relative w-full flex flex-col sm:flex-row sm:justify-between sm:items-start items-center gap-y-12 sm:gap-y-0 sm:gap-x-4">

          <div
            className={`hidden sm:block absolute top-5 left-[12%] right-[12%] h-[2px] ${
              darkMode ? "bg-[#26332d]" : "bg-gray-300"
            }`}
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.2, ease: "easeOut" }}
                className="relative flex flex-col items-center text-center gap-3 w-full sm:flex-1 sm:max-w-[220px] px-2"
              >
                {/* Number badge */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#316312] text-white font-bold text-sm z-10 shadow-sm">
                  {step.number}
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -8, 8, -4, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`flex items-center justify-center w-14 h-14 rounded-full border ${
                    darkMode
                      ? "border-[#26332d] bg-[#16201c]"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      darkMode ? "text-[#9ece6a]" : "text-emerald-700"
                    }`}
                  />
                </motion.div>

                {/* Title + Subtitle */}
                <h3
                  className={`text-base font-bold leading-snug ${
                    darkMode ? "text-gray-100" : "text-emerald-950"
                  }`}
                >
                  {step.title}
                </h3>

                <p
                  className={`text-sm font-medium leading-snug ${
                    darkMode ? "text-[#9ece6a]" : "text-emerald-700"
                  }`}
                >
                  {step.subtitle}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HowWork;