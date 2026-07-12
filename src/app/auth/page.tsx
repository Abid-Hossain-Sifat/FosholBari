"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Truck, Leaf, Phone, UploadCloud } from "lucide-react";

// public ফোল্ডারের ইমেজ import করা যায় না, তাই সরাসরি path ব্যবহার করছি
const loginD = "/Assets/loginD.jpg";
const loginN = "/Assets/loginN.jpg";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("buyer");
  const [profileImage, setProfileImage] = useState(null);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#faf9f5] dark:bg-[#111a17] py-12 transition-colors duration-300">

      {/* মেইন অ্যালাইনমেন্ট কন্টেইনার: navbar-এর সাথে মিলিয়ে max-w-[80%] mx-auto */}
      <div className="w-full max-w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative overflow-hidden">

        {/* ================= বাম পাশ: ইমেজ এবং ফিচার ইনফো =================
             Login এবং Register উভয় অবস্থাতেই অপরিবর্তিত থাকে, শুধু ডান পাশের ফর্ম বদলায়
             mount হওয়ার সময় প্রতিবার fade + slide-up animation চলবে */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
          className="flex flex-col space-y-6 lg:order-1"
        >
          {/* হেডলাইন ও সাবহেডলাইন */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          >
            <h1 className="text-3xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight">
              বিশুদ্ধ প্রকৃতির ছোঁয়া <br />
              <span className="text-[#316312] dark:text-[#8cc655]">ফসলবাড়ি</span>-র সাথে।
            </h1>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              আমাদের স্বাস্থ্য সচেতন অর্গানিক প্রেমীদের কমিউনিটিতে যোগ দিন। সরাসরি কৃষকের মাঠ থেকে আপনার দোরগোড়ায় তাজা পণ্য।
            </p>
          </motion.div>

          {/* মিনি ইনফো কার্ডস */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1a2622] border border-gray-100 dark:border-gray-800 shadow-sm">
              <Leaf className="w-6 h-6 text-[#316312] dark:text-[#8cc655] mb-2" />
              <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">১০০% অর্গানিক</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">স্থানীয় কৃষকদের কাছ থেকে সরাসরি সংগৃহীত রাসায়নিক মুক্ত পণ্য।</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1a2622] border border-gray-100 dark:border-gray-800 shadow-sm">
              <Truck className="w-6 h-6 text-[#316312] dark:text-[#8cc655] mb-2" />
              <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">দ্রুত ডেলিভারি</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">তাজা শাকসবজি এবং নিত্যপ্রয়োজনীয় জিনিসপত্র একই দিনে ডেলিভারি।</p>
            </div>
          </motion.div>

          {/* নেক্সট ইমেজ কন্টেইনার (লাইট/ডার্ক মোড অটো হ্যান্ডেলড) */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.35 }}
            className="relative w-full h-64 rounded-2xl overflow-hidden shadow-md"
          >
            {/* Light Mode Image */}
            <Image
              src={loginD}
              alt="Fasolbari Organic Farm Light"
              fill
              className="object-cover dark:hidden"
              priority
            />
            {/* Dark Mode Image */}
            <Image
              src={loginN}
              alt="Fasolbari Organic Farm Dark"
              fill
              className="object-cover hidden dark:block"
              priority
            />
          </motion.div>
        </motion.div>

        {/* ================= ডান পাশ: ফর্ম সেকশন =================
             শুধু এই অংশটাই isLogin অনুযায়ী animation সহ বদলায়
             আগের width (max-w-md) রেখে ডান কিনারা থেকে শুরু হবে (flex justify-end) */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
          className="w-full flex justify-end lg:order-2"
        >
          {/* ফর্ম কার্ড */}
          <div className="w-full max-w-xl p-8 lg:p-10 rounded-3xl bg-white dark:bg-[#1a2622] border border-gray-100 dark:border-gray-800/50 shadow-2xl shadow-gray-300/50 dark:shadow-black/40 transition-all overflow-hidden">

            <AnimatePresence mode="wait">
              {isLogin ? (
                // ================= লগইন ফর্ম =================
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">স্বাগতম</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">আপনার ফসলবাড়ি অ্যাকাউন্টে লগইন করুন</p>
                  </div>

                  <div className="space-y-5">
                    <form className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">ইমেইল বা ফোন নম্বর</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                          <input type="text" placeholder="example@mail.com" className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#121a18] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] text-gray-800 dark:text-gray-200" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">পাসওয়ার্ড</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                          <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-[#121a18] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] text-gray-800 dark:text-gray-200" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <div className="text-right mt-2">
                          <a href="#" className="text-xs font-medium text-[#316312] dark:text-[#8cc655] hover:underline">পাসওয়ার্ড ভুলে গেছেন?</a>
                        </div>
                      </div>

                      <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#316312] hover:bg-[#254b0e] dark:bg-[#8cc655] dark:hover:bg-[#7bb344] text-white dark:text-[#111a17] font-bold rounded-xl transition shadow-lg shadow-green-900/10 dark:shadow-none text-sm">
                        লগইন করুন <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
                      <span className="text-xs text-gray-400 dark:text-gray-500">অথবা</span>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
                    </div>

                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-3 py-3.5 bg-white dark:bg-[#121a18] border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1a2622] text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition text-sm"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                      </svg>
                      Google দিয়ে চালিয়ে যান
                    </button>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      আপনার কি অ্যাকাউন্ট নেই?{" "}
                      <button onClick={() => setIsLogin(false)} className="text-[#316312] dark:text-[#8cc655] font-bold hover:underline">নতুন অ্যাকাউন্ট খুলুন</button>
                    </p>
                  </div>
                </motion.div>
              ) : (
                // ================= রেজিস্ট্রেশন ফর্ম =================
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">নতুন অ্যাকাউন্ট তৈরি করুন</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">আসুন আমাদের পরিবারের অংশ হয়ে যান।</p>
                  </div>

                  <form className="space-y-4">
                    {/* ভূমিকা নির্বাচন */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">আপনার ভূমিকা নির্বাচন করুন</label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setRole("buyer")}
                          className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                            role === "buyer"
                              ? "bg-[#316312] dark:bg-[#8cc655] text-white dark:text-[#111a17]"
                              : "bg-transparent border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          ক্রেতা
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole("farmer")}
                          className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                            role === "farmer"
                              ? "bg-[#316312] dark:bg-[#8cc655] text-white dark:text-[#111a17]"
                              : "bg-transparent border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          কৃষক
                        </button>
                      </div>
                    </div>

                    {/* পুরো নাম */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">পুরো নাম</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          placeholder="আপনার পুরো নাম লিখুন"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#121a18] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] text-gray-800 dark:text-gray-200"
                        />
                      </div>
                    </div>

                    {/* মোবাইল নম্বর + ইমেইল ঠিকানা */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">মোবাইল নম্বর</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="+৮৮০১৯XXXXXXXX"
                            className="w-full pl-12 pr-2 py-3 bg-gray-50 dark:bg-[#121a18] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] text-gray-800 dark:text-gray-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">ইমেইল ঠিকানা</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="example@mail.com"
                            className="w-full pl-12 pr-2 py-3 bg-gray-50 dark:bg-[#121a18] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] text-gray-800 dark:text-gray-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* প্রোফাইল ছবি আপলোড */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">প্রোফাইল ছবি আপলোড</label>
                      <label
                        htmlFor="profile-upload"
                        className="flex flex-col items-center justify-center gap-1.5 py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-[#316312] dark:hover:border-[#8cc655] transition"
                      >
                        <UploadCloud className="w-5 h-5 text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 text-center px-2">
                          {profileImage ? profileImage.name : "ক্লিক করে ছবি নির্বাচন করুন"}
                        </span>
                        <input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setProfileImage(e.target.files?.[0] ?? null)}
                        />
                      </label>
                    </div>

                    {/* পাসওয়ার্ড + নিশ্চিত করুন */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">পাসওয়ার্ড</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-9 py-3 bg-gray-50 dark:bg-[#121a18] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] text-gray-800 dark:text-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-3.5 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">নিশ্চিত করুন</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-9 py-3 bg-gray-50 dark:bg-[#121a18] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] text-gray-800 dark:text-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-3.5 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#316312] hover:bg-[#254b0e] dark:bg-[#8cc655] dark:hover:bg-[#7bb344] text-white dark:text-[#111a17] font-bold rounded-xl transition shadow-lg shadow-green-900/10 dark:shadow-none text-sm">
                      নিবন্ধন করুন <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                      <button onClick={() => setIsLogin(true)} className="text-[#316312] dark:text-[#8cc655] font-bold hover:underline">লগইন করুন</button>
                    </p>
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

export default AuthPage;