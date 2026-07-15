"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import * as Icons from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getOrders } from "@/lib/data";
import { HarvestLoader } from "@/Components/loading";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

interface BuyerOrder {
  id: string;
  crop: string;
  qty: string;
  total: string;
  date: string;
  status: OrderStatus;
  farmerName: string;
}

const mapOrder = (o: any): BuyerOrder => ({
  id: o._id || String(o.id || ""),
  crop: o.productName || "অজ্ঞাত পণ্য",
  qty: o.weight
    ? String(o.weight)
    : typeof o.qty === "number"
      ? `${o.qty} ${o.unit || "কেজি"}`
      : String(o.qty || "0"),
  total: `৳ ${typeof o.total === "number" ? o.total.toLocaleString("bn-BD") : String(o.total || "0")}`,
  date: o.createdAt
    ? new Date(o.createdAt).toLocaleDateString("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "N/A",
  status: (o.status as OrderStatus) || "Pending",
  farmerName: o.farmerName || "",
});

const AllOrdersPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";
  const { data: session } = authClient.useSession();

  const [activeTab, setActiveTab] = useState("All");
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await getOrders("buyer");
      setOrders(Array.isArray(data) ? data.map(mapOrder) : []);
    } catch (err) {
      console.error(err);
      if (!silent) setOrders([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    loadOrders();

    // Poll so farmer status changes show up here without refresh
    const interval = setInterval(() => loadOrders(true), 5000);
    return () => clearInterval(interval);
  }, [session?.user?.id, loadOrders]);

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Shipped":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === "Delivered") return "ডেলিভার্ড";
    if (status === "Shipped") return "শিপড";
    if (status === "Cancelled") return "বাতিল";
    return "পেন্ডিং";
  };

  const shortId = (id: string) => `#FB-${id.slice(-6).toUpperCase()}`;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-3 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${darkMode ? "text-white" : "text-emerald-950"}`}
          >
            আমার সব অর্ডার
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            আপনার কেনা সব ফসলের ইতিহাস ও বর্তমান ডেলিভারি স্ট্যাটাস
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b dark:border-[#2c3d36] border-gray-200 scrollbar-none">
        {[
          { key: "All", label: "সব অর্ডার" },
          { key: "Pending", label: "পেন্ডিং" },
          { key: "Shipped", label: "শিপড" },
          { key: "Delivered", label: "ডেলিভার্ড" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? darkMode
                  ? "bg-[#9ece6a]/10 text-[#9ece6a]"
                  : "bg-[#008080] text-white shadow-sm"
                : darkMode
                  ? "text-gray-400 hover:bg-[#16201c]"
                  : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
          darkMode
            ? "bg-[#16201c] border-[#2c3d36]"
            : "bg-white border-gray-200"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <HarvestLoader variant="fallback" className="min-h-[300px]" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr
                    className={`text-xs font-bold border-b ${
                      darkMode
                        ? "bg-[#111a17] text-gray-400 border-[#2c3d36]"
                        : "bg-stone-50 text-stone-500 border-gray-200"
                    }`}
                  >
                    <th className="p-4 pl-6">অর্ডার আইডি</th>
                    <th className="p-4">ফসলের নাম</th>
                    <th className="p-4">পরিমাণ</th>
                    <th className="p-4">মোট মূল্য</th>
                    <th className="p-4">অর্ডারের তারিখ</th>
                    <th className="p-4 text-center">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y text-xs sm:text-sm ${darkMode ? "divide-[#2c3d36] text-gray-300" : "divide-gray-100 text-stone-700"}`}
                >
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className={`transition-colors ${darkMode ? "hover:bg-[#1B2420]/40" : "hover:bg-stone-50/50"}`}
                      >
                        <td
                          className={`p-4 pl-6 font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                        >
                          {shortId(order.id)}
                        </td>
                        <td className="p-4 font-semibold">
                          <span className="block">{order.crop}</span>
                          {order.farmerName && (
                            <span className="text-[10px] text-gray-400 font-normal">
                              কৃষক: {order.farmerName}
                            </span>
                          )}
                        </td>
                        <td className="p-4">{order.qty}</td>
                        <td
                          className={`p-4 font-bold ${darkMode ? "text-gray-200" : "text-emerald-950"}`}
                        >
                          {order.total}
                        </td>
                        <td className="p-4 text-gray-400">{order.date}</td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusStyles(order.status)}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-gray-400 font-semibold"
                      >
                        এই ক্যাটাগরিতে কোনো অর্ডার পাওয়া যায়নি!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-100 dark:divide-[#2c3d36]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`p-4 space-y-2 ${darkMode ? "hover:bg-[#1B2420]/40" : "hover:bg-stone-50/50"}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`text-sm font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                      >
                        {shortId(order.id)}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${getStatusStyles(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold">{order.crop}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{order.qty}</span>
                      <span className="font-bold text-emerald-800 dark:text-[#9ece6a]">
                        {order.total}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400 font-semibold text-sm">
                  এই ক্যাটাগরিতে কোনো অর্ডার পাওয়া যায়নি!
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllOrdersPage;
