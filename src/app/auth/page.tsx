"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Truck, Leaf, Phone, UploadCloud } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

// import image
const loginD = "/Assets/loginD.jpg";
const loginN = "/Assets/loginN.jpg";

// Helper to translate Better Auth English error messages to Bengali
const translateError = (errMessage?: string | null): string => {
  if (!errMessage) return "একটি অজানা সমস্যা দেখা দিয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
  
  const msg = errMessage.toLowerCase();
  if (
    msg.includes("invalid email") || 
    msg.includes("invalid credentials") || 
    msg.includes("password is incorrect") || 
    msg.includes("password incorrect")
  ) {
    return "ভুল ইমেইল অথবা পাসওয়ার্ড। সঠিক তথ্য দিয়ে আবার চেষ্টা করুন।";
  }
  if (msg.includes("user not found") || msg.includes("email is not registered")) {
    return "এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।";
  }
  if (msg.includes("email already in use") || msg.includes("email already exists") || msg.includes("email is already registered")) {
    return "এই ইমেইল ঠিকানাটি ইতিমধ্যে ব্যবহার করা হয়েছে। অন্য ইমেইল ব্যবহার করুন।";
  }
  if (msg.includes("password must be") || msg.includes("password is too short")) {
    return "পাসওয়ার্ডটি খুব ছোট। পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।";
  }
  if (msg.includes("failed to fetch") || msg.includes("network error")) {
    return "সার্ভারের সাথে সংযোগ করা যাচ্ছে না। অনুগ্রহ করে ইন্টারনেট সংযোগ পরীক্ষা করুন।";
  }
  
  return errMessage;
};

const AuthPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // If user is already logged in, redirect them to the home page
  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("buyer");
  const [profileImage, setProfileImage] = useState<File | null>(null);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Helper to upload image to ImgBB
  const uploadImageToImgBB = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const apiKey = process.env.NEXT_PUBLIC_IMAGEBB_API;
      if (!apiKey) {
        throw new Error("NEXT_PUBLIC_IMAGEBB_API environment variable is not defined");
      }
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        return data.data.url;
      }
    } catch (err) {
      console.error("ImgBB upload error:", err);
    }
    return null;
  };

  // Credentials Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const { data, error: loginErr } = await authClient.signIn.email({
        email: loginEmail,
        password: loginPassword,
        callbackURL: window.location.origin + "/",
      });

      if (loginErr) {
        const msg = translateError(loginErr.message);
        setError(msg);
        toast.error(msg);
      } else {
        toast.success("লগইন সফল হয়েছে!");
        window.location.href = "/";
      }
    } catch (err) {
      const msg = translateError(err instanceof Error ? err.message : null);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Credentials Signup (registers without auto login, redirects to login form)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (signupPassword !== signupConfirmPassword) {
      const msg = "পাসওয়ার্ড দুটি মিলছে না!";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    try {
      let imageUrl = "";
      if (profileImage) {
        const uploadedUrl = await uploadImageToImgBB(profileImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          const msg = "প্রোফাইল ছবি আপলোড ব্যর্থ হয়েছে।";
          setError(msg);
          toast.error(msg);
          setLoading(false);
          return;
        }
      }

      const signUpRole = role === "buyer" ? "Buyer" : "Farmer";

      const { data, error: signupErr } = await authClient.signUp.email({
        email: signupEmail,
        password: signupPassword,
        name: signupName,
        phoneNumber: signupPhone,
        role: signUpRole,
        image: imageUrl || undefined,
        callbackURL: window.location.origin + "/",
      });

      if (signupErr) {
        const msg = translateError(signupErr.message);
        setError(msg);
        toast.error(msg);
      } else {
        // Show success and switch to login screen as requested
        const msg = "নিবন্ধন সফল হয়েছে! অনুগ্রহ করে লগইন করুন।";
        setSuccess(msg);
        toast.success(msg);
        setIsLogin(true);
        // Clear signup fields
        setSignupName("");
        setSignupPhone("");
        setSignupEmail("");
        setSignupPassword("");
        setSignupConfirmPassword("");
        setProfileImage(null);
      }
    } catch (err) {
      const msg = translateError(err instanceof Error ? err.message : null);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + "/",
      });
    } catch (err) {
      const msg = translateError(err instanceof Error ? err.message : "গুগল দিয়ে লগইন করা যায়নি।");
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  // Prevent UI flashing while checking session or if redirecting
  if (isPending || session) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#faf9f5] dark:bg-[#111a17] transition-colors duration-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#316312] dark:border-[#8cc655] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">অপেক্ষা করুন...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#faf9f5] dark:bg-[#111a17] py-12 transition-colors duration-300">

      {/* main container */}
      <div className="w-full max-w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative overflow-hidden">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
          className="flex flex-col space-y-6 lg:order-1"
        >
          {/* Headline */}
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

          {/* info cards */}
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

          {/* Image container */}
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
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 100, damping: 18 }}
          className="w-full flex justify-end lg:order-2"
        >
          {/* Form*/}
          <div className="w-full max-w-xl p-8 lg:p-10 rounded-3xl bg-white dark:bg-[#1a2622] border border-gray-100 dark:border-gray-800/50 shadow-2xl shadow-gray-300/50 dark:shadow-black/40 transition-all overflow-hidden">

            {/* Error Message Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Success Message Display */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 text-green-600 dark:text-green-400 text-xs font-semibold rounded-xl text-center"
              >
                {success}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {isLogin ? (
                // ================= Login =================
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
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">ইমেইল ঠিকানা</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="example@mail.com"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#121a18] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] text-gray-800 dark:text-gray-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">পাসওয়ার্ড</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-[#121a18] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] text-gray-800 dark:text-gray-200"
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <div className="text-right mt-2">
                          <a href="#" className="text-xs font-medium text-[#316312] dark:text-[#8cc655] hover:underline">পাসওয়ার্ড ভুলে গেছেন?</a>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#316312] hover:bg-[#254b0e] dark:bg-[#8cc655] dark:hover:bg-[#7bb344] text-white dark:text-[#111a17] font-bold rounded-xl transition shadow-lg shadow-green-900/10 dark:shadow-none text-sm cursor-pointer disabled:opacity-55"
                      >
                        {loading ? "লগইন হচ্ছে..." : "লগইন করুন"} <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
                      <span className="text-xs text-gray-400 dark:text-gray-500">অথবা</span>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-3 py-3.5 bg-white dark:bg-[#121a18] border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#1a2622] text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition text-sm cursor-pointer disabled:opacity-55"
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
                      <button onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }} className="text-[#316312] dark:text-[#8cc655] font-bold hover:underline cursor-pointer">নতুন অ্যাকাউন্ট খুলুন</button>
                    </p>
                  </div>
                </motion.div>
              ) : (
                // ================= Registration =================
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

                  <form onSubmit={handleSignup} className="space-y-4">
                    {/* Role */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">আপনার ভূমিকা নির্বাচন করুন</label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setRole("buyer")}
                          className={`px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
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
                          className={`px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
                            role === "farmer"
                              ? "bg-[#316312] dark:bg-[#8cc655] text-white dark:text-[#111a17]"
                              : "bg-transparent border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          কৃষক
                        </button>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">পুরো নাম</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          placeholder="আপনার পুরো নাম লিখুন"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#121a18] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] text-gray-800 dark:text-gray-200"
                        />
                      </div>
                    </div>

                    {/* Number + email */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">মোবাইল নম্বর</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            required
                            value={signupPhone}
                            onChange={(e) => setSignupPhone(e.target.value)}
                            placeholder="+৮৮০১XXXXXXXXX"
                            className="w-full pl-12 pr-2 py-3 bg-gray-50 dark:bg-[#121a18] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] text-gray-800 dark:text-gray-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">ইমেইল ঠিকানা</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            required
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="example@mail.com"
                            className="w-full pl-12 pr-2 py-3 bg-gray-50 dark:bg-[#121a18] border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#316312] dark:focus:ring-[#8cc655] text-gray-800 dark:text-gray-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Profile */}
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

                    {/* Password */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">পাসওয়ার্ড</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
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
                            required
                            value={signupConfirmPassword}
                            onChange={(e) => setSignupConfirmPassword(e.target.value)}
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

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#316312] hover:bg-[#254b0e] dark:bg-[#8cc655] dark:hover:bg-[#7bb344] text-white dark:text-[#111a17] font-bold rounded-xl transition shadow-lg shadow-green-900/10 dark:shadow-none text-sm cursor-pointer disabled:opacity-55"
                    >
                      {loading ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন করুন"} <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>



                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                      <button onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }} className="text-[#316312] dark:text-[#8cc655] font-bold hover:underline cursor-pointer">লগইন করুন</button>
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