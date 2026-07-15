"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Trash2, Loader2, Search, MessageSquare } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getDemands, deleteAnyDemand } from "@/lib/data";
import { toast } from "react-toastify";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const AdminDemandsPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";
  const { data: session } = authClient.useSession();

  const [demands, setDemands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadDemands = async () => {
    setLoading(true);
    try {
      const data = await getDemands();
      setDemands(Array.isArray(data) ? data : []);
    } catch {
      toast.error("চাহিদা তালিকা লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;
    loadDemands();
  }, [session?.user?.id]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("আপনি কি এই চাহিদাটি মুছতে চান?")) return;
    try {
      await deleteAnyDemand(id);
      toast.success("চাহিদা মুছে ফেলা হয়েছে।");
      loadDemands();
    } catch {
      toast.error("চাহিদা মুছতে ব্যর্থ হয়েছে।");
    }
  };

  const filtered = demands.filter(
    (d) =>
      d.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.crop?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.buyerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? "text-white" : "text-emerald-950"}`}
          >
            চাহিদা ব্যবস্থাপনা
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            মোট {demands.length} টি চাহিদা
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="ফসল বা ক্রেতার নামে খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080]/30 ${
            darkMode
              ? "bg-[#16201c] border-[#2c3d36] text-gray-200 placeholder-gray-500"
              : "bg-white border-gray-200 text-stone-800 placeholder-gray-400"
          }`}
        />
      </div>

      <div
        className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
          darkMode
            ? "bg-[#16201c] border-[#2c3d36]"
            : "bg-white border-gray-200"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm font-medium">
            {searchTerm ? "কোনো চাহিদা পাওয়া যায়নি।" : "কোনো চাহিদা নেই।"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr
                  className={`text-xs font-bold border-b ${
                    darkMode
                      ? "bg-[#111a17] text-gray-400 border-[#2c3d36]"
                      : "bg-stone-50 text-stone-500 border-gray-200"
                  }`}
                >
                  <th className="p-4 pl-6">ফসল</th>
                  <th className="p-4">ক্রেতা</th>
                  <th className="p-4">পরিমাণ</th>
                  <th className="p-4">বাজেট</th>
                  <th className="p-4">অবস্থান</th>
                  <th className="p-4">মন্তব্য</th>
                  <th className="p-4">স্ট্যাটাস</th>
                  <th className="p-4 pr-6 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs sm:text-sm ${darkMode ? "divide-[#2c3d36] text-gray-300" : "divide-gray-100 text-stone-700"}`}
              >
                {filtered.map((demand: any) => (
                  <tr
                    key={demand._id}
                    className={`transition-colors ${darkMode ? "hover:bg-[#1B2420]/40" : "hover:bg-stone-50/50"}`}
                  >
                    <td
                      className={`p-4 pl-6 font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                    >
                      {demand.productName || demand.crop || "অজ্ঞাত"}
                    </td>
                    <td className="p-4 text-gray-400">
                      {demand.buyerName || "অজ্ঞাত"}
                    </td>
                    <td className="p-4">{demand.quantity || demand.qty || "—"}</td>
                    <td className="p-4 font-semibold">
                      {demand.budget ? `৳${demand.budget}` : "—"}
                    </td>
                    <td className="p-4 text-gray-400">
                      {demand.location || "—"}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-gray-400">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{demand.responses || 0}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          demand.status === "Active"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                        }`}
                      >
                        {demand.status === "Active" ? "সক্রিয়" : "নিষ্ক্রিয়"}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <button
                        onClick={() => handleDelete(demand._id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDemandsPage;
