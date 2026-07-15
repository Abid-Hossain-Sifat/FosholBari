"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Users,
  ShoppingBag,
  FileText,
  CreditCard,
  ArrowRight,
  Clock,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getAdminStats, getAdminOrders } from "@/lib/data";
import { HarvestLoader } from "@/Components/loading";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalDemands: number;
  totalRevenue: number;
  pendingOrders: number;
}

const statusStyles: Record<string, string> = {
  Delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  Shipped: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

const statusLabel = (s: string) => {
  if (s === "Delivered") return "ডেলিভার্ড";
  if (s === "Shipped") return "শিপড";
  if (s === "Cancelled") return "বাতিল";
  return "পেন্ডিং";
};

const AdminPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";
  const { data: session } = authClient.useSession();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, orders] = await Promise.all([
        getAdminStats(),
        getAdminOrders(),
      ]);
      if (s) setStats(s);
      if (Array.isArray(orders)) setRecentOrders(orders.slice(0, 5));
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    loadData();
  }, [session?.user?.id, loadData]);

  const statCards = [
    {
      label: "মোট ব্যবহারকারী",
      value: stats?.totalUsers ?? "—",
      sub: "সকল রোল",
      icon: Users,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      label: "মোট পণ্য",
      value: stats?.totalProducts ?? "—",
      sub: "এক্সপ্লোর এ",
      icon: ShoppingBag,
      color: "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "মোট অর্ডার",
      value: stats?.totalOrders ?? "—",
      sub: `${stats?.pendingOrders ?? 0} টি পেন্ডিং`,
      icon: Clock,
      color: "bg-amber-500/10 text-amber-600",
    },
    {
      label: "মোট চাহিদা",
      value: stats?.totalDemands ?? "—",
      sub: "ক্রেতাদের কাছ থেকে",
      icon: FileText,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      label: "মোট আয়",
      value:
        stats?.totalRevenue != null
          ? `৳ ${stats.totalRevenue.toLocaleString("bn-BD")}`
          : "—",
      sub: "ডেলিভার্ড অর্ডার",
      icon: CreditCard,
      color: "bg-rose-500/10 text-rose-600",
      span: true,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div>
        <h1
          className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? "text-white" : "text-emerald-950"}`}
        >
          অ্যাডমিন ড্যাশবোর্ড
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          সম্পূর্ণ প্ল্যাটফর্মের সার্বিক অবস্থা
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`p-6 rounded-2xl border shadow-sm flex items-start justify-between transition-colors ${
                (card as any).span ? "sm:col-span-2 lg:col-span-1" : ""
              } ${
                darkMode
                  ? "bg-[#16201c] border-[#2c3d36]"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="space-y-2">
                <span className="text-xs sm:text-sm font-semibold text-gray-400 block">
                  {card.label}
                </span>
                <h3
                  className={`text-3xl sm:text-4xl font-black ${darkMode ? "text-white" : "text-emerald-950"}`}
                >
                  {loading ? "—" : card.value}
                </h3>
                <span className="text-xs text-gray-400 block">{card.sub}</span>
              </div>
              <div className={`p-3 rounded-xl ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div
        className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
          darkMode
            ? "bg-[#16201c] border-[#2c3d36]"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="p-5 sm:p-6 flex items-center justify-between border-b border-gray-200 dark:border-[#2c3d36]">
          <h2
            className={`text-lg sm:text-xl font-bold ${darkMode ? "text-white" : "text-emerald-950"}`}
          >
            সাম্প্রতিক অর্ডার
          </h2>
          <Link
            href="/dashboard/admin/orders"
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
          <div className="flex items-center justify-center min-h-[300px]">
            <HarvestLoader variant="fallback" className="min-h-[300px]" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm font-medium">
            এখনো কোনো অর্ডার নেই।
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
                    <th className="p-4">ক্রেতা</th>
                    <th className="p-4">পণ্য</th>
                    <th className="p-4">পরিমাণ</th>
                    <th className="p-4">মোট</th>
                    <th className="p-4 pr-6 text-center">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y text-xs sm:text-sm ${darkMode ? "divide-[#2c3d36] text-gray-300" : "divide-gray-100 text-stone-700"}`}
                >
                  {recentOrders.map((order: any) => (
                    <tr
                      key={order._id}
                      className={`transition-colors ${darkMode ? "hover:bg-[#1B2420]/40" : "hover:bg-stone-50/50"}`}
                    >
                      <td
                        className={`p-4 pl-6 font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                      >
                        #FB-{(order._id ?? "").slice(-6).toUpperCase()}
                      </td>
                      <td className="p-4 font-semibold">
                        {order.buyerName || "অজ্ঞাত"}
                      </td>
                      <td className="p-4">{order.productName || "—"}</td>
                      <td className="p-4">{order.qty || order.weight || "—"}</td>
                      <td className="p-4 font-semibold">
                        ৳{(order.total ?? 0).toLocaleString("bn-BD")}
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyles[order.status] || statusStyles.Pending}`}
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
              {recentOrders.map((order: any) => (
                <div
                  key={order._id}
                  className={`p-4 space-y-2 ${darkMode ? "hover:bg-[#1B2420]/40" : "hover:bg-stone-50/50"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`text-sm font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                    >
                      #FB-{(order._id ?? "").slice(-6).toUpperCase()}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shrink-0 ${statusStyles[order.status] || statusStyles.Pending}`}
                    >
                      {statusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">
                    {order.productName || "—"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{order.buyerName || "অজ্ঞাত"}</span>
                    <span>৳{(order.total ?? 0).toLocaleString("bn-BD")}</span>
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

export default AdminPage;
