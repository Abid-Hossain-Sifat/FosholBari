"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import * as Icons from "lucide-react";
import { toast } from "react-toastify";
import { HarvestLoader } from "@/Components/loading";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const DEMANDS_URL = process.env.NEXT_PUBLIC_DEMANDS_URL || "http://localhost:11111/demands";

interface Demand {
  _id?: string;
  id?: string;
  crop?: string;
  productName?: string;
  qty?: string;
  quantity?: string;
  budget?: string | number;
  deadline?: string | Date;
  status?: string;
  responses?: number;
}

const DemandPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  // Form states
  const [crop, setCrop] = useState("");
  const [qty, setQty] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Demands list state
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);

  // Deletion state for custom confirmation modal
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchMyDemands = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${DEMANDS_URL}?my=true`, { credentials: "include" });
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
  }, []);

  useEffect(() => {
    fetchMyDemands();
  }, [fetchMyDemands]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop || !qty) {
      setError("ফসলের নাম এবং পরিমাণ দেওয়া আবশ্যক।");
      return;
    }
    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        crop,
        qty,
        budget,
        deadline,
        description,
      };

      const res = await fetch(DEMANDS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => ({}));

      if (res.status >= 400 || (result?.message && !result?._id)) {
        setError(result.message || "চাহিদা পোস্ট করতে সমস্যা হয়েছে।");
        return;
      }

      toast.success("আপনার চাহিদা সফলভাবে পোস্ট করা হয়েছে!");
      // Reset form
      setCrop("");
      setQty("");
      setBudget("");
      setDeadline("");
      setDescription("");
      
      // Reload demands list
      fetchMyDemands();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "চাহিদা পোস্ট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    const targetId = deleteConfirmId;
    setDeleteConfirmId(null);
    try {
      const res = await fetch(`${DEMANDS_URL}/${targetId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok && result?.message === "Deleted") {
        toast.success("চাহিদাটি সফলভাবে মুছে ফেলা হয়েছে।");
        fetchMyDemands();
      } else {
        toast.error(result?.message || "চাহিদাটি মুছতে ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      toast.error("চাহিদাটি মুছতে সমস্যা হয়েছে।");
    }
  };

  const formatBudget = (budgetVal: string | number | undefined) => {
    if (!budgetVal) return "—";
    const num = Number(budgetVal);
    if (isNaN(num)) return `৳ ${budgetVal}`;
    return `৳ ${num.toLocaleString("bn-BD")}`;
  };

  const formatDate = (dateStr: string | Date | undefined) => {
    if (!dateStr) return "N/A";
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

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400">
          <Icons.AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

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

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                ফসলের নাম *
              </label>
              <input
                type="text"
                required
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
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
                  পরিমাণ (কেজি/মণ) *
                </label>
                <input
                  type="text"
                  required
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
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
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
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
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ফসলের মান বা বিশেষ কোনো শর্ত থাকলে লিখুন..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none ${
                  darkMode
                    ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                    : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                darkMode
                  ? "bg-[#9ece6a] text-black hover:bg-[#8cc655]"
                  : "bg-[#008080] text-white hover:bg-emerald-700"
              } ${isSubmitting ? "opacity-75 cursor-wait" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <Icons.Loader2 className="w-4 h-4 animate-spin" />
                  পোস্ট হচ্ছে...
                </>
              ) : (
                "চাহিদা পোস্ট করুন"
              )}
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
            {loading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <HarvestLoader variant="fallback" className="min-h-[300px]" />
              </div>
            ) : demands.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm font-medium">
                এখনো কোনো চাহিদা পোস্ট করা হয়নি।
              </div>
            ) : (
              demands.map((demand) => {
                const demandId = demand._id || demand.id || "";
                return (
                  <div
                    key={demandId}
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
                          {demand.crop || demand.productName}
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
                        আইডি: <span className="font-semibold">DM-{String(demandId).slice(-4).toUpperCase()}</span> •
                        পরিমাণ:{" "}
                        <span className="font-semibold">{demand.qty || demand.quantity}</span> •
                        বাজেট:{" "}
                        <span className="font-semibold">{formatBudget(demand.budget)}</span>
                      </p>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1">
                        <Icons.Calendar className="w-3 h-3" /> শেষ সময়:{" "}
                        {formatDate(demand.deadline)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-200 dark:border-[#2c3d36]">
                      <div className="text-left sm:text-right mr-2">
                        <span
                          className={`text-xs font-bold block ${(demand.responses || 0) > 0 ? "text-orange-500" : "text-gray-400"}`}
                        >
                          {demand.responses || 0} টি অফার এসেছে
                        </span>
                      </div>
                      <button
                        onClick={() => setDeleteConfirmId(demandId)}
                        className="p-2 rounded-lg border transition-all text-xs font-bold flex items-center gap-1 shrink-0 bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
                      >
                        <Icons.Trash2 className="w-4 h-4" /> মুছুন
                      </button>
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
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setDeleteConfirmId(null)}
          />
          
          {/* Modal Container */}
          <div
            className={`relative w-full max-w-md transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all border ${
              darkMode
                ? "bg-[#16201c] border-[#2c3d36] text-white"
                : "bg-white border-gray-200 text-stone-900"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-red-500/10 text-red-500">
                <Icons.AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">নিশ্চিতকরণ</h3>
            </div>
            
            <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              আপনি কি নিশ্চিতভাবে এই চাহিদাটি মুছে ফেলতে চান? এটি আর ফেরত আনা যাবে না।
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  darkMode
                    ? "bg-[#111a17] border-[#2c3d36] hover:bg-[#1b2723] text-gray-300"
                    : "bg-stone-50 border-gray-200 hover:bg-stone-100 text-stone-700"
                }`}
              >
                বাতিল করুন
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all bg-red-500 text-white hover:bg-red-600 shadow-md"
              >
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandPage;