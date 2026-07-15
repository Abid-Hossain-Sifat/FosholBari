"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ShoppingBag, Truck, CreditCard, ArrowRight, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getOrders } from "@/lib/data";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

interface BuyerOrder {
  id: string;
  crop: string;
  qty: string;
  date: string;
  status: OrderStatus;
  total: number;
}

const statusStyles: Record<OrderStatus, string> = {
  Delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  Shipped: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusLabel = (status: OrderStatus) => {
  if (status === "Delivered") return "ডেলিভার্ড";
  if (status === "Shipped") return "শিপড";
  if (status === "Cancelled") return "বাতিল";
  return "পেন্ডিং";
};

const mapOrder = (o: any): BuyerOrder => ({
  id: o._id || String(o.id || ""),
  crop: o.productName || "অজ্ঞাত পণ্য",
  qty: o.weight
    ? String(o.weight)
    : typeof o.qty === "number"
      ? `${o.qty} ${o.unit || "কেজি"}`
      : String(o.qty || "0"),
  date: o.createdAt
    ? new Date(o.createdAt).toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A",
  status: (o.status as OrderStatus) || "Pending",
  total: typeof o.total === "number" ? o.total : 0,
});

const BuyerPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";
  const { data: session } = authClient.useSession();

  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getOrders("buyer");
      setOrders(Array.isArray(data) ? data.map(mapOrder) : []);
    } catch {
      if (!silent) setOrders([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    loadOrders();
    const interval = setInterval(() => loadOrders(true), 5000);
    return () => clearInterval(interval);
  }, [session?.user?.id, loadOrders]);

  const recentOrders = orders.slice(0, 5);
  const totalOrders = orders.length;
  const activeDeliveries = orders.filter(
    (o) => o.status === "Pending" || o.status === "Shipped",
  ).length;
  const totalSpent = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? "text-white" : "text-emerald-950"}`}
          >
            ড্যাশবোর্ড ওভারভিউ
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            আজকের বাজার এবং আপনার অর্ডার ট্র্যাক করুন
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div
          className={`p-6 rounded-2xl border shadow-sm flex items-start justify-between transition-colors ${
            darkMode ? "bg-[#16201c] border-[#2c3d36]" : "bg-white border-gray-200"
          }`}
        >
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-semibold text-gray-400 block">
              মোট অর্ডার
            </span>
            <h3
              className={`text-3xl sm:text-4xl font-black ${darkMode ? "text-white" : "text-emerald-950"}`}
            >
              {loading ? "—" : `${totalOrders} টি`}
            </h3>
            <span
              className={`text-xs font-semibold ${darkMode ? "text-[#9ece6a]" : "text-[#008080]"}`}
            >
              আপনার সকল অর্ডার
            </span>
          </div>
          <div
            className={`p-3 rounded-xl ${darkMode ? "bg-[#8cc655]/10 text-[#8cc655]" : "bg-[#008080]/10 text-[#008080]"}`}
          >
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div
          className={`p-6 rounded-2xl border shadow-sm flex items-start justify-between transition-colors ${
            darkMode ? "bg-[#16201c] border-[#2c3d36]" : "bg-white border-gray-200"
          }`}
        >
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-semibold text-gray-400 block">
              চলমান ডেলিভারি
            </span>
            <h3
              className={`text-3xl sm:text-4xl font-black ${darkMode ? "text-white" : "text-emerald-950"}`}
            >
              {loading ? "—" : `${activeDeliveries} টি`}
            </h3>
            <span className="text-xs text-gray-400 block">
              ডেলিভারি ট্র্যাকিং এ আছে
            </span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div
          className={`p-6 rounded-2xl border shadow-sm flex items-start justify-between sm:col-span-2 lg:col-span-1 transition-colors ${
            darkMode ? "bg-[#16201c] border-[#2c3d36]" : "bg-white border-gray-200"
          }`}
        >
          <div className="space-y-2">
            <span className="text-xs sm:text-sm font-semibold text-gray-400 block">
              মোট খরচ
            </span>
            <h3
              className={`text-3xl sm:text-4xl font-black ${darkMode ? "text-white" : "text-emerald-950"}`}
            >
              {loading ? "—" : `৳ ${totalSpent.toLocaleString("bn-BD")}`}
            </h3>
            <span className="text-xs text-gray-400 block">সকল অর্ডারের হিসেব</span>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div
        className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
          darkMode ? "bg-[#16201c] border-[#2c3d36]" : "bg-white border-gray-200"
        }`}
      >
        <div className="p-5 sm:p-6 flex items-center justify-between border-b border-gray-200 dark:border-[#2c3d36]">
          <h2
            className={`text-lg sm:text-xl font-bold ${darkMode ? "text-white" : "text-emerald-950"}`}
          >
            সাম্প্রতিক অর্ডার সমূহ
          </h2>
          <Link
            href="/dashboard/buyer/all-orders"
            className={`text-sm font-bold flex items-center gap-1 transition-colors ${
              darkMode
                ? "text-[#9ece6a] hover:text-[#9ece6a]/80"
                : "text-[#008080] hover:text-emerald-700"
            }`}
          >
            সবগুলো দেখুন <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">লোড হচ্ছে...</span>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm font-medium">
            এখনো কোনো অর্ডার নেই। এক্সপ্লোর থেকে পণ্য কিনুন।
          </div>
        ) : (
          <>
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr
                    className={`text-xs font-bold border-b ${
                      darkMode
                        ? "bg-[#111a17] text-gray-400 border-[#2c3d36]"
                        : "bg-stone-50 text-stone-500 border-gray-200"
                    }`}
                  >
                    <th className="p-4 pl-6">অর্ডার আইডি</th>
                    <th className="p-4">ফসল</th>
                    <th className="p-4">পরিমাণ</th>
                    <th className="p-4">তারিখ</th>
                    <th className="p-4 pr-6 text-center">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y text-xs sm:text-sm ${darkMode ? "divide-[#2c3d36] text-gray-300" : "divide-gray-100 text-stone-700"}`}
                >
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className={`transition-colors ${darkMode ? "hover:bg-[#1B2420]/40" : "hover:bg-stone-50/50"}`}
                    >
                      <td
                        className={`p-4 pl-6 font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                      >
                        #FB-{order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="p-4 font-semibold">{order.crop}</td>
                      <td className="p-4">{order.qty}</td>
                      <td className="p-4 text-gray-400">{order.date}</td>
                      <td className="p-4 pr-6 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyles[order.status]}`}
                        >
                          {statusLabel(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-100 dark:divide-[#2c3d36]">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 space-y-2 ${darkMode ? "hover:bg-[#1B2420]/40" : "hover:bg-stone-50/50"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`text-sm font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                    >
                      #FB-{order.id.slice(-6).toUpperCase()}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${statusStyles[order.status]}`}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">{order.crop}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{order.qty}</span>
                    <span>{order.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BuyerPage;
