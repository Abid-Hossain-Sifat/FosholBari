"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CornerDownRight,
  Loader2,
  Calendar,
  DollarSign,
  Package,
  PlusCircle,
  X,
  Info,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { HarvestLoader } from "@/Components/loading";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const DEMANDS_URL = process.env.NEXT_PUBLIC_DEMANDS_URL || "http://localhost:11111/demands";

interface Comment {
  id: string;
  authorName: string;
  authorRole: "farmer" | "buyer";
  text: string;
  time: string;
}

interface Demand {
  _id?: string;
  id?: string;
  buyerName?: string;
  buyerInitial?: string;
  location?: string;
  createdAt?: string | Date;
  crop?: string;
  productName?: string;
  quantity?: string;
  qty?: string;
  description?: string;
  budget?: string | number;
  deadline?: string | Date;
  status?: string;
  responses?: number;
  comments?: Comment[];
}

const DemandPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  const { data: session } = authClient.useSession();

  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Completed'>('All');

  useEffect(() => {
    const fetchAllDemands = async () => {
      setLoading(true);
      try {
        const res = await fetch(DEMANDS_URL, { credentials: "include" });
        if (!res.ok) {
          setDemands([]);
          return;
        }
        const data = await res.json();
        setDemands(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching demands:", err);
        setDemands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDemands();
  }, []);

  const handleCommentClick = (demandId: string) => {
    if (!session?.user) {
      toast.warning("মন্তব্য বা প্রস্তাব করতে প্রথমে লগইন করুন।");
      return;
    }
    const user = session.user as { role?: string };
    if (user.role !== "Farmer") {
      toast.error("শুধুমাত্র কৃষকরাই ক্রেতার চাহিদাতে মন্তব্য বা প্রস্তাব করতে পারেন।");
      return;
    }
    setActiveCommentBox(demandId);
    setCommentText("");
  };

  const handleAddComment = async (demandId: string) => {
    if (!commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`${DEMANDS_URL}/${demandId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: commentText.trim() }),
      });

      const updatedDemand = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(updatedDemand.message || "মন্তব্য/প্রস্তাব যোগ করতে ব্যর্থ হয়েছে।");
      }

      setDemands((prev) =>
        prev.map((d) => {
          const idVal = d._id || d.id;
          if (idVal === demandId) {
            return updatedDemand;
          }
          return d;
        })
      );

      setCommentText("");
      setActiveCommentBox(null);
      toast.success("আপনার প্রস্তাবটি সফলভাবে পোস্ট করা হয়েছে!");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "প্রস্তাব পোস্ট করতে ব্যর্থ হয়েছে।";
      toast.error(errMsg);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatPostedAt = (createdAtStr: string | Date | undefined) => {
    if (!createdAtStr) return "N/A";
    try {
      const date = new Date(createdAtStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return "এইমাত্র";
      if (diffMins < 60) return `${diffMins.toLocaleString("bn-BD")} মিনিট আগে`;
      if (diffHours < 24) return `${diffHours.toLocaleString("bn-BD")} ঘণ্টা আগে`;
      if (diffDays === 1) return "১ দিন আগে";
      return `${diffDays.toLocaleString("bn-BD")} দিন আগে`;
    } catch {
      return String(createdAtStr);
    }
  };

  const formatCommentTime = (timeStr: string | Date | undefined) => {
    if (!timeStr) return "N/A";
    if (timeStr === "এখনই") return timeStr;
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return String(timeStr);
      return date.toLocaleTimeString("bn-BD", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }) + " " + date.toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return String(timeStr);
    }
  };

  const formatBudget = (budget: string | number | undefined) => {
    if (!budget) return "আলোচনা সাপেক্ষ";
    const num = Number(budget);
    if (isNaN(num)) return `৳ ${budget}`;
    return `৳ ${num.toLocaleString("bn-BD")}`;
  };

  const formatDate = (dateStr: string | Date | undefined) => {
    if (!dateStr) return "জরুরি";
    try {
      return new Date(dateStr).toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return String(dateStr);
    }
  };

  const filteredDemands = demands.filter((d) => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Active") return d.status === "Active";
    return d.status !== "Active";
  });

  return (
    <div
      className={`w-full min-h-screen py-8 sm:py-12 transition-colors duration-300 ${
        darkMode ? "bg-[#1B2420]" : "bg-[#faf9f5]"
      }`}
    >
      <div className="max-w-[92%] sm:max-w-[88%] md:max-w-[85%] lg:max-w-[80%] mx-auto flex flex-col gap-6 sm:gap-8">
        {/* Header & Primary CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-1.5"
          >
            <h1
              className={`text-2xl sm:text-3xl font-extrabold ${
                darkMode ? "text-[#9ece6a]" : "text-emerald-800"
              }`}
            >
              ক্রেতাদের চাহিদা বোর্ড
            </h1>
            <p
              className={`text-xs sm:text-sm max-w-xl ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              ক্রেতারা কী ফসল বা কৃষিপণ্য খুঁজছেন দেখুন, এবং নিবন্ধিত কৃষক হিসেবে সরাসরি আপনার সেরা দর ও প্রস্তাব পাঠান।
            </p>
          </motion.div>

          <Link
            href={session?.user && (session.user as { role?: string }).role === "Buyer" ? "/dashboard/buyer/demand" : "/auth"}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#316312] hover:bg-[#254b0e] dark:bg-[#8cc655] dark:hover:bg-[#7bb344] text-white dark:text-[#111a17] text-sm font-bold shadow-sm transition-all whitespace-nowrap self-start sm:self-auto min-h-[44px] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন চাহিদা দিন</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3 overflow-x-auto select-none">
          {(["All", "Active", "Completed"] as const).map((tab) => {
            const label = tab === "All" ? "সকল চাহিদা" : tab === "Active" ? "চলতি চাহিদা" : "সম্পন্ন";
            const count = tab === "All" 
              ? demands.length 
              : tab === "Active" 
              ? demands.filter(d => d.status === "Active").length 
              : demands.filter(d => d.status !== "Active").length;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 min-h-[38px] ${
                  statusFilter === tab
                    ? "bg-[#316312] text-white dark:bg-[#8cc655] dark:text-[#111a17] shadow-sm"
                    : "bg-white dark:bg-[#16201c] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-800"
                }`}
              >
                <span>{label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  statusFilter === tab
                    ? "bg-white/20 dark:bg-black/20 text-white dark:text-[#111a17]"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Demand list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center min-h-[350px]">
              <HarvestLoader variant="fallback" className="min-h-[350px]" />
            </div>
          ) : filteredDemands.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-center py-24 min-h-[350px] rounded-3xl border border-dashed border-gray-300 dark:border-emerald-800/40 bg-white/50 dark:bg-[#16201c]/50 p-6">
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-[#316312] dark:text-[#8cc655] mb-3">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                {statusFilter === "Active" 
                  ? "বর্তমানে কোনো চলতি চাহিদা নেই" 
                  : statusFilter === "Completed"
                  ? "কোনো সম্পন্ন চাহিদা পাওয়া যায়নি"
                  : "এখনো কোনো চাহিদা পোস্ট করা হয়নি"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                আপনার প্রয়োজনীয় কৃষিপণ্যের বিবরণ জানিয়ে নতুন চাহিদা তৈরি করতে পারেন।
              </p>
              <Link
                href={session?.user && (session.user as { role?: string }).role === "Buyer" ? "/dashboard/buyer/demand" : "/auth"}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#316312] hover:bg-[#254b0e] dark:bg-[#8cc655] dark:hover:bg-[#7bb344] text-white dark:text-[#111a17] text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>চাহিদা পোস্ট করুন</span>
              </Link>
            </div>
          ) : (
            filteredDemands.map((demand, index) => {
              const demandId = demand._id || demand.id || "";
              const buyerName = demand.buyerName || "অজ্ঞাত ক্রেতা";
              const buyerInitial = demand.buyerInitial || buyerName.charAt(0);
              const commentsList = demand.comments || [];

              return (
                <motion.div
                  key={demandId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
                  whileHover={{ y: -5 }}
                  className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-full justify-between ${
                    darkMode
                      ? "bg-[#16201c] border-[#26332d] hover:border-[#9ece6a]/40"
                      : "bg-white border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex-grow flex flex-col gap-5">
                    {/* Card Header: Buyer info & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-base flex-shrink-0 shadow-sm">
                          {buyerInitial}
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`text-sm sm:text-base font-bold ${
                              darkMode ? "text-gray-100" : "text-emerald-950"
                            }`}
                          >
                            {buyerName}
                          </span>
                          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              {demand.location || "অজ্ঞাত স্থান"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                              {formatPostedAt(demand.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full self-start sm:self-center border ${
                          demand.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                        }`}
                      >
                        {demand.status === "Active" ? "চলতি চাহিদা" : "সম্পন্ন চাহিদা"}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="space-y-4">
                      <div>
                        <h3
                          className={`text-base sm:text-lg font-extrabold ${
                            darkMode ? "text-white" : "text-emerald-950"
                          }`}
                        >
                          {demand.productName || demand.crop}
                        </h3>
                        {demand.description && (
                          <p
                            className={`text-xs sm:text-sm leading-relaxed mt-1.5 line-clamp-3 ${
                              darkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {demand.description}
                          </p>
                        )}
                      </div>

                      {/* Key details grid with Enhanced Typography & Contrast */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                        <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center text-center ${
                          darkMode ? "bg-[#111a17] border-[#2c3d36]" : "bg-emerald-50/40 border-emerald-100/70"
                        }`}>
                          <span className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1 font-semibold">
                            <Package className="w-3.5 h-3.5 text-[#316312] dark:text-[#8cc655]" /> পরিমাণ
                          </span>
                          <span className={`text-xs sm:text-sm font-extrabold ${darkMode ? "text-[#9ece6a]" : "text-emerald-800"}`}>
                            {demand.quantity || demand.qty}
                          </span>
                        </div>
                        <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center text-center ${
                          darkMode ? "bg-[#111a17] border-[#2c3d36]" : "bg-emerald-50/40 border-emerald-100/70"
                        }`}>
                          <span className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1 font-semibold">
                            <DollarSign className="w-3.5 h-3.5 text-[#316312] dark:text-[#8cc655]" /> বাজেট
                          </span>
                          <span className={`text-xs sm:text-sm font-extrabold ${darkMode ? "text-[#9ece6a]" : "text-emerald-800"}`}>
                            {formatBudget(demand.budget)}
                          </span>
                        </div>
                        <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center text-center ${
                          darkMode ? "bg-[#111a17] border-[#2c3d36]" : "bg-emerald-50/40 border-emerald-100/70"
                        }`}>
                          <span className="text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-1 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-[#316312] dark:text-[#8cc655]" /> সময়সীমা
                          </span>
                          <span className={`text-xs sm:text-sm font-extrabold ${darkMode ? "text-[#9ece6a]" : "text-emerald-800"}`}>
                            {formatDate(demand.deadline)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className={`h-px my-4 sm:my-5 ${
                      darkMode ? "bg-[#26332d]" : "bg-gray-100"
                    }`}
                  />

                  {/* Comments / Proposals */}
                  <div className="flex flex-col gap-3">
                    {commentsList.length > 0 && (
                      <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-1">
                        {commentsList.map((comment: Comment) => (
                          <div
                            key={comment.id}
                            className="flex items-start gap-2"
                          >
                            <CornerDownRight
                              className={`w-3.5 h-3.5 mt-1 flex-shrink-0 ${
                                darkMode ? "text-gray-500" : "text-gray-400"
                              }`}
                            />
                            <div
                              className={`flex-1 rounded-xl px-3 py-2 text-xs sm:text-sm ${
                                comment.authorRole === "buyer"
                                  ? darkMode
                                    ? "bg-[#9ece6a]/10 border border-[#9ece6a]/20"
                                    : "bg-emerald-50/70 border border-emerald-100"
                                  : darkMode
                                  ? "bg-[#1B2420] border border-[#26332d]"
                                  : "bg-gray-50 border border-gray-200/70"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className={`text-xs font-bold ${
                                    darkMode ? "text-gray-200" : "text-emerald-950"
                                  }`}
                                >
                                  {comment.authorName}
                                </span>
                                <span
                                  className={`text-[10px] ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                  }`}
                                >
                                  {formatCommentTime(comment.time)}
                                </span>
                              </div>
                              <p
                                className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }`}
                              >
                                {comment.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Role Notice for non-farmers */}
                    {session?.user && (session.user as { role?: string }).role !== "Farmer" && (
                      <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
                        <Info className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>শুধুমাত্র কৃষকরাই এই চাহিদায় সরাসরি দরপ্রস্তাব পাঠাতে পারেন।</span>
                      </div>
                    )}

                    {/* Add comment toggle / box */}
                    {activeCommentBox === demandId ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddComment(demandId);
                          }}
                          placeholder="আপনার সেরা দর ও প্রস্তাব লিখুন..."
                          aria-label="আপনার প্রস্তাব বা মন্তব্য লিখুন"
                          autoFocus
                          disabled={submittingComment}
                          className={`flex-1 px-3 py-2 rounded-xl text-sm outline-none border transition-colors ${
                            darkMode
                              ? "bg-[#1B2420] border-[#26332d] text-gray-200 placeholder:text-gray-500 focus:border-[#9ece6a]/60"
                              : "bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-emerald-400"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setActiveCommentBox(null)}
                          disabled={submittingComment}
                          aria-label="বাতিল করুন"
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddComment(demandId)}
                          disabled={submittingComment || !commentText.trim()}
                          aria-label="প্রস্তাব পাঠান"
                          className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#316312] text-white hover:bg-[#264d0e] dark:bg-[#8cc655] dark:text-[#111a17] dark:hover:bg-[#7bb344] transition-colors flex-shrink-0 disabled:opacity-50 cursor-pointer shadow-sm"
                        >
                          {submittingComment ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </motion.button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => handleCommentClick(demandId)}
                          className={`flex items-center gap-2 text-xs sm:text-sm font-bold self-start transition-colors min-h-[38px] px-3.5 py-1.5 rounded-xl border cursor-pointer ${
                            darkMode
                              ? "bg-[#111a17] border-[#26332d] text-gray-300 hover:text-[#9ece6a] hover:border-[#9ece6a]/40"
                              : "bg-emerald-50/50 border-emerald-200/80 text-emerald-800 hover:bg-emerald-100/70"
                          }`}
                        >
                          <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-[#9ece6a]" />
                          <span>মন্তব্য বা দরপ্রস্তাব করুন</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DemandPage;