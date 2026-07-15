"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import {
  TrendingUp,
  ShoppingBag,
  Leaf,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { authClient } from "@/lib/auth-client";
import { getFarmerStats, getOrders } from "@/lib/data";
import { HarvestLoader } from "@/Components/loading";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const bnMonths = ["জানু", "ফেব্রু", "মার্চ", "এপ্রি", "মে", "জুন", "জুলা", "আগ", "সেপ্টে", "অক্টো", "নভে", "ডিসে"];

interface FarmerStats {
  totalProducts: number;
  outOfStock: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: any[];
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

const FarmerPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";
  const { data: session } = authClient.useSession();
  const farmerName = session?.user?.name || "কৃষক";

  const [stats, setStats] = useState<FarmerStats | null>(null);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, orders] = await Promise.all([
        getFarmerStats(),
        getOrders("farmer"),
      ]);
      if (s) setStats(s as FarmerStats);
      if (Array.isArray(orders)) setAllOrders(orders);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    loadData();
  }, [session?.user?.id, loadData]);

  const revenue = stats?.totalRevenue ?? 0;
  const totalOrders = stats?.totalOrders ?? 0;
  const totalProducts = stats?.totalProducts ?? 0;
  const outOfStock = stats?.outOfStock ?? 0;
  const pendingOrders = stats?.pendingOrders ?? 0;
  const recentOrders = stats?.recentOrders ?? [];

  // Build monthly chart data from all orders
  const monthlyMap = new Map<number, number>();
  for (const o of allOrders) {
    if (o.createdAt && (o.status === "Delivered")) {
      const d = new Date(o.createdAt);
      const m = d.getMonth();
      monthlyMap.set(m, (monthlyMap.get(m) || 0) + (o.total || 0));
    }
  }
  const chartData = bnMonths.map((name, i) => ({
    name,
    income: monthlyMap.get(i) || 0,
  }));
  const hasChartData = chartData.some((d) => d.income > 0);

  // Build category data from product names in orders
  const categoryCount = new Map<string, number>();
  for (const o of allOrders) {
    const name = o.productName || "অন্যান্য";
    categoryCount.set(name, (categoryCount.get(name) || 0) + 1);
  }
  const sortedCats = [...categoryCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const totalCatCount = sortedCats.reduce((s, [, c]) => s + c, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={`px-3 py-2 rounded-xl border shadow-lg text-xs font-semibold ${
        darkMode
          ? "bg-[#16201c] border-[#2c3d36] text-gray-200"
          : "bg-white border-gray-200 text-stone-800"
      }`}>
        <p className="text-gray-400 mb-1">{label}</p>
        <p className={darkMode ? "text-[#9ece6a]" : "text-emerald-700"}>
          ৳{payload[0].value.toLocaleString("bn-BD")}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          স্বাগতম, {farmerName}!
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          আজকে আপনার খামারের পণ্য এবং অর্ডারের সংক্ষিপ্ত বিবরণ।
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
          darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">মোট উপার্জন</p>
              <h3 className="text-2xl font-bold mt-2">
                {loading ? "—" : `৳${revenue.toLocaleString("bn-BD")}`}
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${darkMode ? "bg-[#8cc655]/20 text-[#9ece6a]" : "bg-[#316312] text-white"}`}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-xs text-emerald-600 dark:text-[#9ece6a] font-medium">
            <ArrowUpRight size={14} />
            <span>ডেলিভার্ড অর্ডার থেকে</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
          darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">মোট অর্ডার</p>
              <h3 className="text-2xl font-bold mt-2">{loading ? "—" : `${totalOrders} টি`}</h3>
            </div>
            <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-xs text-gray-400">
            <span>{pendingOrders} টি পেন্ডিং</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
          darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">সক্রিয় ফসল</p>
              <h3 className="text-2xl font-bold mt-2">{loading ? "—" : `${totalProducts} টি`}</h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-[#316312]/10 text-emerald-800 dark:text-[#9ece6a]">
              <Leaf size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-xs text-gray-400">
            <span>{outOfStock > 0 ? `${outOfStock} টি স্টকের বাইরে` : "সব পণ্য স্টকে আছে"}</span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
          darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">পেন্ডিং ডেলিভারি</p>
              <h3 className="text-2xl font-bold mt-2">{loading ? "—" : `${pendingOrders} টি`}</h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-500">
              <Clock size={20} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-4 text-xs text-amber-500 font-semibold">
            <span>দ্রুত প্যাকেজিং করা প্রয়োজন</span>
          </div>
        </div>
      </div>

      {/* Sales Analytics & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className={`p-5 rounded-2xl border ${darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"} lg:col-span-2`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg">বিক্রয়ের বিশ্লেষণ</h3>
              <p className="text-xs text-gray-400">মাসিক আয়ের ট্র্যাকিং</p>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <HarvestLoader variant="fallback" className="!min-h-0" />
            </div>
          ) : !hasChartData ? (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm font-medium">
              এখনো কোনো ডেলিভার্ড অর্ডার নেই। অর্ডার পেলে এখানে চার্ট প্রদর্শিত হবে।
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={darkMode ? "#9ece6a" : "#316312"} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={darkMode ? "#9ece6a" : "#316312"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#26332d" : "#e5e7eb"}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: darkMode ? "#9ca3af" : "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: darkMode ? "#9ca3af" : "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `৳${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: darkMode ? "#9ece6a" : "#316312", strokeWidth: 1, strokeDasharray: "4 4" }} />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke={darkMode ? "#9ece6a" : "#316312"}
                    strokeWidth={2.5}
                    fill="url(#incomeGrad)"
                    activeDot={{ r: 6, fill: darkMode ? "#9ece6a" : "#316312", stroke: darkMode ? "#16201c" : "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Categories Breakdown */}
        <div className={`p-5 rounded-2xl border ${darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"} flex flex-col justify-between`}>
          <div>
            <h3 className="font-bold text-lg mb-1">সর্বাধিক বিক্রিত</h3>
            <p className="text-xs text-gray-400 mb-6">সবচেয়ে বেশি অর্ডারকৃত পণ্য</p>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
                  </div>
                ))}
              </div>
            ) : sortedCats.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">এখনো কোনো অর্ডার নেই</p>
            ) : (
              <div className="space-y-4">
                {sortedCats.map(([name, count]) => {
                  const pct = totalCatCount > 0 ? Math.round((count / totalCatCount) * 100) : 0;
                  return (
                    <div key={name}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="truncate">{name}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${darkMode ? "bg-[#8cc655]" : "bg-[#316312]"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 mt-4 border border-dashed border-gray-200 dark:border-gray-800">
            <span className="text-xs font-semibold text-gray-400 block mb-1">কৃষি পরামর্শ:</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              বাজারে এখন <strong className="text-emerald-700 dark:text-[#9ece6a]">অর্গানিক সবজির</strong> ব্যাপক চাহিদা। আপনার স্টকে আরো সবজি যুক্ত করতে পারেন!
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className={`rounded-2xl border ${darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"}`}>
        <div className="p-5 border-b border-gray-200 dark:border-[#26332d]">
          <h3 className="font-bold text-lg">সাম্প্রতিক অর্ডার</h3>
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <HarvestLoader variant="fallback" className="!min-h-0" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm font-medium">
            এখনো কোনো অর্ডার নেই।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className={`text-xs font-bold border-b ${darkMode ? "bg-[#111a17] text-gray-400 border-[#26332d]" : "bg-stone-50 text-stone-500 border-gray-200"}`}>
                  <th className="p-4 pl-6">ক্রেতা</th>
                  <th className="p-4">পণ্য</th>
                  <th className="p-4">পরিমাণ</th>
                  <th className="p-4">মোট</th>
                  <th className="p-4 pr-6 text-center">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-xs sm:text-sm ${darkMode ? "divide-[#26332d] text-gray-300" : "divide-gray-100 text-stone-700"}`}>
                {recentOrders.map((order: any) => (
                  <tr key={order._id} className={`transition-colors ${darkMode ? "hover:bg-[#1B2420]/40" : "hover:bg-stone-50/50"}`}>
                    <td className={`p-4 pl-6 font-bold ${darkMode ? "text-white" : "text-stone-900"}`}>
                      {order.buyerName || "অজ্ঞাত"}
                    </td>
                    <td className="p-4">{order.productName || "—"}</td>
                    <td className="p-4">{order.qty || order.weight || "—"}</td>
                    <td className="p-4 font-semibold">৳{(order.total ?? 0).toLocaleString("bn-BD")}</td>
                    <td className="p-4 pr-6 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyles[order.status] || statusStyles.Pending}`}>
                        {statusLabel(order.status)}
                      </span>
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

export default FarmerPage;
