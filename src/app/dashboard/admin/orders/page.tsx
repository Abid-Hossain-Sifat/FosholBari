"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Trash2, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getAdminOrders, updateAnyOrderStatus, deleteAnyOrder } from "@/lib/data";
import { toast } from "react-toastify";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const statusStyles: Record<string, string> = {
  Delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  Shipped: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const AdminOrdersPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";
  const { data: session } = authClient.useSession();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      toast.error("অর্ডার তালিকা লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;
    loadOrders();
  }, [session?.user?.id]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateAnyOrderStatus(orderId, newStatus);
      toast.success("অর্ডার স্ট্যাটাস আপডেট করা হয়েছে।");
      loadOrders();
    } catch (err: any) {
      toast.error(err.message || "স্ট্যাটাস পরিবর্তন করতে ব্যর্থ হয়েছে।");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!window.confirm("আপনি কি এই অর্ডারটি মুছতে চান?")) return;
    try {
      await deleteAnyOrder(orderId);
      toast.success("অর্ডার মুছে ফেলা হয়েছে।");
      loadOrders();
    } catch {
      toast.error("অর্ডার মুছতে ব্যর্থ হয়েছে।");
    }
  };

  const filtered = orders.filter(
    (o) =>
      o.buyerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? "text-white" : "text-emerald-950"}`}
          >
            অর্ডার ব্যবস্থাপনা
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            মোট {orders.length} টি অর্ডার
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="ক্রেতা, পণ্য বা অর্ডার আইডি দ্বারা খুঁজুন..."
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
            {searchTerm ? "কোনো অর্ডার পাওয়া যায়নি।" : "কোনো অর্ডার নেই।"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr
                  className={`text-xs font-bold border-b ${
                    darkMode
                      ? "bg-[#111a17] text-gray-400 border-[#2c3d36]"
                      : "bg-stone-50 text-stone-500 border-gray-200"
                  }`}
                >
                  <th className="p-4 pl-6">অর্ডার আইডি</th>
                  <th className="p-4">ক্রেতা</th>
                  <th className="p-4">কৃষক</th>
                  <th className="p-4">পণ্য</th>
                  <th className="p-4">পরিমাণ</th>
                  <th className="p-4">মোট</th>
                  <th className="p-4">স্ট্যাটাস</th>
                  <th className="p-4 pr-6 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs sm:text-sm ${darkMode ? "divide-[#2c3d36] text-gray-300" : "divide-gray-100 text-stone-700"}`}
              >
                {filtered.map((order: any) => (
                  <tr
                    key={order._id}
                    className={`transition-colors ${darkMode ? "hover:bg-[#1B2420]/40" : "hover:bg-stone-50/50"}`}
                  >
                    <td
                      className={`p-4 pl-6 font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                    >
                      <Link
                        href={`/explore/${order.productId}`}
                        className="hover:text-[#008080] transition-colors"
                      >
                        #FB-{(order._id ?? "").slice(-6).toUpperCase()}
                      </Link>
                    </td>
                    <td className="p-4 font-semibold">
                      {order.buyerName || "অজ্ঞাত"}
                    </td>
                    <td className="p-4 text-gray-400">
                      {order.farmerName || "—"}
                    </td>
                    <td className="p-4">{order.productName || "—"}</td>
                    <td className="p-4">
                      {order.qty || order.weight || "—"}
                    </td>
                    <td className="p-4 font-semibold">
                      ৳{(order.total ?? 0).toLocaleString("bn-BD")}
                    </td>
                    <td className="p-4">
                      <div className="relative inline-block">
                        <select
                          value={order.status || "Pending"}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          disabled={updatingId === order._id}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border appearance-none cursor-pointer focus:outline-none disabled:opacity-50 ${
                            statusStyles[order.status] || statusStyles.Pending
                          } ${
                            darkMode ? "bg-[#111a17]" : "bg-white"
                          }`}
                        >
                          <option value="Pending">পেন্ডিং</option>
                          <option value="Shipped">শিপড</option>
                          <option value="Delivered">ডেলিভার্ড</option>
                          <option value="Cancelled">বাতিল</option>
                        </select>
                        {updatingId === order._id && (
                          <Loader2 className="w-3 h-3 animate-spin absolute -right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <button
                        onClick={() => handleDelete(order._id)}
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

export default AdminOrdersPage;
