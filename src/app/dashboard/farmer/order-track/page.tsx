"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import * as Icons from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getOrders, updateOrderStatus } from "@/lib/data";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

type OrderStatus = "Pending" | "Shipped" | "Delivered";

interface Order {
  id: string;
  buyer: string;
  phone: string;
  address: string;
  product: string;
  qty: string;
  total: string;
  date: string;
  status: OrderStatus;
}

const mapBackendOrder = (o: any): Order => {
  return {
    id: o._id || String(o.id || ""),
    buyer: o.buyerName || "অজ্ঞাত ক্রেতা",
    phone: o.phone || "N/A",
    address: o.address || "N/A",
    product: o.productName || "অজ্ঞাত পণ্য",
    qty: typeof o.qty === "number" ? `${o.qty} কেজি` : String(o.qty || "0"),
    total: `৳${typeof o.total === "number" ? o.total.toLocaleString("bn-BD") : String(o.total || "0")}`,
    date: o.createdAt
      ? new Date(o.createdAt).toLocaleDateString("bn-BD", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "N/A",
    status: o.status as OrderStatus,
  };
};

const filterTabs: { key: "All" | OrderStatus; label: string }[] = [
  { key: "All", label: "সব অর্ডার" },
  { key: "Pending", label: "পেন্ডিং" },
  { key: "Shipped", label: "শিপড" },
  { key: "Delivered", label: "ডেলিভারড" },
];

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "Pending", label: "পেন্ডিং" },
  { value: "Shipped", label: "শিপড" },
  { value: "Delivered", label: "ডেলিভারড" },
];

const statusBadgeClasses = (status: OrderStatus, darkMode: boolean) => {
  if (status === "Pending") {
    return darkMode
      ? "bg-amber-950/20 text-amber-500"
      : "bg-amber-50 text-amber-600";
  }
  if (status === "Shipped") {
    return darkMode
      ? "bg-teal-950/20 text-teal-400"
      : "bg-teal-50 text-teal-600";
  }
  return darkMode
    ? "bg-[#316312]/10 text-[#9ece6a]"
    : "bg-emerald-50 text-emerald-800";
};

const StatusDropdown = ({
  order,
  darkMode,
  onChange,
  className = "",
}: {
  order: Order;
  darkMode: boolean;
  onChange: (orderId: string, status: OrderStatus) => void;
  className?: string;
}) => (
  <div
    className={`relative shrink-0 ${className}`}
    onClick={(e) => e.stopPropagation()}
  >
    <select
      value={order.status}
      onChange={(e) => onChange(order.id, e.target.value as OrderStatus)}
      className={`appearance-none w-full text-xs font-bold pl-3 pr-7 py-2 rounded-xl border border-transparent outline-none cursor-pointer transition-all ${statusBadgeClasses(
        order.status,
        darkMode,
      )}`}
    >
      {statusOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <Icons.ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
  </div>
);

const OrderTrackingPage: React.FC = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  const { data: session } = authClient.useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"All" | OrderStatus>("All");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getOrders("farmer");
        if (Array.isArray(data)) {
          setOrders(data.map(mapBackendOrder));
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session?.user?.id]);

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((o) => o.status === activeTab);

  const countFor = (key: "All" | OrderStatus) =>
    key === "All"
      ? orders.length
      : orders.filter((o) => o.status === key).length;

  const cardClasses = `rounded-2xl border ${
    darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"
  }`;

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );
      setSelectedOrder((prev) =>
        prev && prev.id === orderId ? { ...prev, status } : prev,
      );
    } catch (err) {
      console.error(err);
      alert("অর্ডার স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Icons.PackageSearch className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
          অর্ডার ট্র্যাকিং
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          আপনার কাছে আসা সকল অর্ডারের লাইভ আপডেট ও বিবরণ দেখুন।
        </p>
      </div>

      {/* Filter Tabs */}
      {/* ✅ FIX: -mb-1 → mb-4 — tabs আর cards-এর মাঝে gap */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-4">
        {filterTabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-1.5 ${
                isActive
                  ? darkMode
                    ? "bg-[#9ece6a] border-[#9ece6a] text-black"
                    : "bg-[#316312] border-[#316312] text-white"
                  : darkMode
                    ? "bg-[#16201c] border-[#26332d] text-gray-300 hover:bg-[#202f2a]"
                    : "bg-white border-gray-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {tab.label}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? darkMode
                      ? "bg-black/20 text-black"
                      : "bg-white/20 text-white"
                    : darkMode
                      ? "bg-[#26332d] text-gray-300"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                {countFor(tab.key)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Order List */}
      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <Icons.Loader2 className="w-6 h-6 animate-spin text-[#316312] dark:text-[#9ece6a]" />
            <span className="text-sm font-medium">অর্ডার লোড হচ্ছে...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className={`${cardClasses} p-8 text-center text-sm text-gray-400`}>
            এই ক্যাটাগরিতে কোনো অর্ডার নেই।
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`${cardClasses} p-4 sm:p-5 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md`}
            >
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    darkMode
                      ? "bg-[#8cc655]/10 text-[#9ece6a]"
                      : "bg-[#316312]/10 text-[#316312]"
                  }`}
                >
                  <Icons.Leaf className="w-5 h-5" />
                </div>

                {/* Product & buyer */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-400">#{order.id.slice(-6).toUpperCase()}</p>
                  <h3 className="font-bold truncate">{order.product}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {order.buyer} • {order.qty}
                  </p>
                </div>

                {/* Total + Status stacked */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="font-bold text-sm">{order.total}</span>
                  <StatusDropdown
                    order={order}
                    darkMode={darkMode}
                    onChange={handleStatusChange}
                    className="w-28"
                  />
                </div>

                <Icons.ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <div
            className={`relative w-full max-w-md rounded-2xl border shadow-xl p-5 sm:p-6 ${
              darkMode
                ? "bg-[#16201c] border-[#26332d]"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-semibold text-gray-400">
                  {selectedOrder.id}
                </p>
                <h3
                  className={`text-lg font-bold flex items-center gap-2 ${
                    darkMode ? "text-white" : "text-emerald-950"
                  }`}
                >
                  <Icons.PackageCheck className="w-5 h-5 text-[#316312] dark:text-[#9ece6a]" />
                  অর্ডার বিবরণ
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400">
                  বর্তমান অবস্থা
                </span>
                <StatusDropdown
                  order={selectedOrder}
                  darkMode={darkMode}
                  onChange={handleStatusChange}
                  className="w-32"
                />
              </div>

              <div className={`border-t ${darkMode ? "border-[#26332d]" : "border-gray-100"}`} />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1">পণ্য</p>
                  <p className="text-sm font-semibold">{selectedOrder.product}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1">পরিমাণ</p>
                  <p className="text-sm font-semibold">{selectedOrder.qty}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1">মোট মূল্য</p>
                  <p className="text-sm font-semibold">{selectedOrder.total}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1">অর্ডারের তারিখ</p>
                  <p className="text-sm font-semibold">{selectedOrder.date}</p>
                </div>
              </div>

              <div className={`border-t ${darkMode ? "border-[#26332d]" : "border-gray-100"}`} />

              <div>
                <p className="text-xs font-bold text-gray-400 mb-2">ক্রেতার তথ্য</p>
                <div className="flex items-center gap-2 mb-2">
                  <Icons.User className="w-4 h-4 text-[#316312] dark:text-[#9ece6a] shrink-0" />
                  <span className="text-sm font-semibold">{selectedOrder.buyer}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Icons.Phone className="w-4 h-4 text-[#316312] dark:text-[#9ece6a] shrink-0" />
                  <span className="text-sm font-semibold">{selectedOrder.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Icons.MapPin className="w-4 h-4 text-[#316312] dark:text-[#9ece6a] shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold">{selectedOrder.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;