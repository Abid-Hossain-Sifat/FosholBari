"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
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
} from "lucide-react";
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
    if (!commentText.trim()) return;

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

  return (
    <div
      className={`w-full min-h-screen py-12 transition-colors duration-300 ${
        darkMode ? "bg-[#1B2420]" : "bg-[#faf9f5]"
      }`}
    >
      <div className="max-w-[92%] sm:max-w-[88%] md:max-w-[85%] lg:max-w-[80%] mx-auto flex flex-col gap-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col gap-1"
        >
          <h2
            className={`text-2xl sm:text-3xl font-bold ${
              darkMode ? "text-[#9ece6a]" : "text-emerald-800"
            }`}
          >
            ক্রেতাদের চাহিদা
          </h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            ক্রেতারা কী পণ্য খুঁজছেন দেখুন, এবং কৃষক হিসেবে আপনি সরাসরি
            যোগাযোগ করতে পারবেন।
          </p>
        </motion.div>

        {/* Demand list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center min-h-[400px]">
              <HarvestLoader variant="fallback" className="min-h-[400px]" />
            </div>
          ) : demands.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center text-center py-32 min-h-[400px] rounded-2xl border border-dashed border-gray-300 dark:border-emerald-800/40 text-gray-400 text-base font-medium">
              এখনো কোনো চাহিদা পোস্ট করা হয়নি।
            </div>
          ) : (
            demands.map((demand, index) => {
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
                  transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                  className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-full justify-between ${
                    darkMode
                      ? "bg-[#16201c] border-[#26332d] hover:border-[#9ece6a]/30"
                      : "bg-white border-gray-200 hover:border-emerald-200"
                  }`}
                >
                  <div className="flex-grow flex flex-col gap-5">
                    {/* Card Header: Buyer info & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                        className={`text-xs font-bold px-3 py-1 rounded-full self-start sm:self-center border ${
                          demand.status === "Active"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        }`}
                      >
                        {demand.status === "Active" ? "চলতি চাহিদা" : "সম্পন্ন চাহিদা"}
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="space-y-4">
                      <div>
                        <h3
                          className={`text-lg font-bold ${
                            darkMode ? "text-white" : "text-emerald-950"
                          }`}
                        >
                          {demand.productName || demand.crop}
                        </h3>
                        {demand.description && (
                          <p
                            className={`text-sm leading-relaxed mt-1.5 ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {demand.description}
                          </p>
                        )}
                      </div>

                      {/* Key details grid */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${
                          darkMode ? "bg-[#111a17] border-[#2c3d36]" : "bg-stone-50/50 border-gray-100"
                        }`}>
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 flex items-center gap-1 mb-1">
                            <Package className="w-3 h-3 text-emerald-600" /> পরিমাণ
                          </span>
                          <span className={`text-xs sm:text-sm font-bold ${darkMode ? "text-[#9ece6a]" : "text-emerald-700"}`}>
                            {demand.quantity || demand.qty}
                          </span>
                        </div>
                        <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${
                          darkMode ? "bg-[#111a17] border-[#2c3d36]" : "bg-stone-50/50 border-gray-100"
                        }`}>
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 flex items-center gap-1 mb-1">
                            <DollarSign className="w-3 h-3 text-emerald-600" /> বাজেট
                          </span>
                          <span className={`text-xs sm:text-sm font-bold ${darkMode ? "text-[#9ece6a]" : "text-emerald-700"}`}>
                            {formatBudget(demand.budget)}
                          </span>
                        </div>
                        <div className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center ${
                          darkMode ? "bg-[#111a17] border-[#2c3d36]" : "bg-stone-50/50 border-gray-100"
                        }`}>
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3 text-emerald-600" /> সময়সীমা
                          </span>
                          <span className={`text-xs sm:text-sm font-bold ${darkMode ? "text-[#9ece6a]" : "text-emerald-700"}`}>
                            {formatDate(demand.deadline)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div
                    className={`h-px my-5 ${
                      darkMode ? "bg-[#26332d]" : "bg-gray-150"
                    }`}
                  />

                  {/* Comments */}
                  <div className="flex flex-col gap-3">
                    {commentsList.length > 0 && (
                      <div className="flex flex-col gap-3">
                        {commentsList.map((comment: Comment) => (
                          <div
                            key={comment.id}
                            className="flex items-start gap-2"
                          >
                            <CornerDownRight
                              className={`w-4 h-4 mt-1 flex-shrink-0 ${
                                darkMode ? "text-gray-600" : "text-gray-400"
                              }`}
                            />
                            <div
                              className={`flex-1 rounded-xl px-3 py-2 ${
                                comment.authorRole === "buyer"
                                  ? darkMode
                                    ? "bg-[#9ece6a]/10"
                                    : "bg-emerald-50"
                                  : darkMode
                                  ? "bg-[#1B2420]"
                                  : "bg-gray-50"
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
                                    darkMode ? "text-gray-500" : "text-gray-400"
                                  }`}
                                >
                                  {formatCommentTime(comment.time)}
                                </span>
                              </div>
                              <p
                                className={`text-sm mt-0.5 ${
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
                          placeholder="আপনার প্রস্তাব লিখুন..."
                          autoFocus
                          className={`flex-1 px-3 py-2 rounded-xl text-sm outline-none border transition-colors ${
                            darkMode
                              ? "bg-[#1B2420] border-[#26332d] text-gray-200 placeholder:text-gray-500 focus:border-[#9ece6a]/50"
                              : "bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-emerald-300"
                          }`}
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddComment(demandId)}
                          aria-label="Send comment"
                          className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#316312] text-white hover:bg-[#264d0e] transition-colors flex-shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCommentClick(demandId)}
                        className={`flex items-center gap-2 text-sm font-semibold self-start transition-colors ${
                          darkMode
                            ? "text-gray-400 hover:text-[#9ece6a]"
                            : "text-gray-600 hover:text-emerald-700"
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        মন্তব্য / প্রস্তাব করুন
                      </button>
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