"use client";

import React, { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const Subscribe = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    // TODO: Replace with real API call later
    console.log("Subscribing email:", email);

    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div
      className={`w-full py-12 transition-colors duration-300 ${
        darkMode ? "bg-[#1B2420]" : "bg-[#faf9f5]"
      }`}
    >
      <div className="max-w-[92%] sm:max-w-[88%] md:max-w-[85%] lg:max-w-[80%] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full rounded-2xl bg-[#316312] px-6 sm:px-10 py-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
        >
          {/* Text content */}
          <div className="flex flex-col gap-2 max-w-lg">
            <h3 className="text-white font-bold text-lg">
              নতুন অফার পেতে সাবস্ক্রাইব করুন
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              প্রতিদিন নতুন সব ডিসকাউন্ট এবং টাটকা পণ্যের আপডেট সবার আগে পেতে
              আমাদের সাথেই থাকুন।
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full lg:w-auto flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="আপনার ইমেইল..."
              className="w-full sm:w-72 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 text-sm outline-none focus:border-white/50 transition-colors"
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-[#316312] font-bold text-sm hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              {submitted ? "সাবস্ক্রাইব হয়েছে!" : "সাবস্ক্রাইব"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Subscribe;