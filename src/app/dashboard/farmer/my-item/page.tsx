"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import {
  Edit3, Trash2, Plus, Search, Package, TrendingUp,
  AlertTriangle, Check, X, Wheat, Carrot, Apple,
  FlaskConical, Loader2, type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { exploreCollection, updateProduct, deleteProduct } from "@/lib/data";
import { toast } from "react-toastify";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  stock: number;
  sales: number;
  image?: string;
}

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const categoryIconMap: Record<string, LucideIcon> = {
  "ধান ও চাল": Wheat,
  "শাক-সবজি": Carrot,
  "মৌসুমি ফল": Apple,
  "খাঁটি মশলা": FlaskConical,
};
const getCategoryIcon = (cat: string): LucideIcon => categoryIconMap[cat] ?? Package;

const MyProductsPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  const { data: session } = authClient.useSession();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [saving, setSaving] = useState(false);

  // Deletion modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // ── Fetch farmer's own products ───────────────────────────────────
  useEffect(() => {
    if (!session?.user?.id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await exploreCollection({ farmerId: session.user.id, page: 1 });
        // Fetch all pages
        const all: Product[] = [...(res.data || [])];
        if (res.totalPages > 1) {
          const rest = await Promise.all(
            Array.from({ length: res.totalPages - 1 }, (_, i) =>
              exploreCollection({ farmerId: session.user.id, page: i + 2 })
            )
          );
          rest.forEach((r) => all.push(...(r.data || [])));
        }
        setProducts(all);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session?.user?.id]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Delete Handlers ───────────────────────────────────────────────
  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    const targetId = deleteTargetId;
    setDeleteTargetId(null);

    try {
      await deleteProduct(targetId);
      setProducts((prev) => prev.filter((p) => p._id !== targetId));
      toast.success("পণ্যটি সফলভাবে মুছে ফেলা হয়েছে।");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "মুছতে সমস্যা হয়েছে, আবার চেষ্টা করুন।";
      toast.error(msg);
    }
  };

  // ── Quick edit save ───────────────────────────────────────────────
  const handleSaveQuickEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);
    try {
      await updateProduct(editingProduct._id, {
        name: editName,
        category: editCategory,
        unit: editUnit,
        price: Number(editPrice),
        stock: Number(editStock),
      });
      setProducts((prev) =>
        prev.map((p) =>
          p._id === editingProduct._id
            ? {
                ...p,
                name: editName,
                category: editCategory,
                unit: editUnit,
                stock: Number(editStock),
                price: Number(editPrice),
              }
            : p
        )
      );
      setEditingProduct(null);
      toast.success("পণ্যটির স্টক ও মূল্য সফলভাবে আপডেট করা হয়েছে।");
    } catch {
      toast.error("আপডেট করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = `w-full px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-1 transition-all ${
    darkMode
      ? "bg-[#1B2420] border-[#26332d] focus:border-[#8cc655] focus:ring-[#8cc655]"
      : "bg-gray-50 border-gray-200 focus:border-[#316312] focus:ring-[#316312]"
  }`;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            আমার পণ্যসমূহ
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            আপনার খামারের আপলোড করা সব পণ্য এখান থেকে পরিচালনা ও স্টক আপডেট করুন।
          </p>
        </div>
        <Link
          href="/dashboard/farmer/add-item"
          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 ${
            darkMode
              ? "bg-[#8cc655] hover:bg-[#9ece6a] text-[#111a17]"
              : "bg-[#316312] hover:bg-emerald-800 text-white"
          }`}
        >
          <Plus size={16} /> নতুন পণ্য যোগ করুন
        </Link>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="পণ্যের নাম বা ক্যাটাগরি দিয়ে খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-1 transition-all ${
            darkMode
              ? "bg-[#16201c] border-[#26332d] focus:border-[#8cc655] focus:ring-[#8cc655]"
              : "bg-white border-gray-200 focus:border-[#316312] focus:ring-[#316312]"
          }`}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium">পণ্য লোড হচ্ছে...</span>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const isOutOfStock = product.stock === 0;
              const isLowStock = product.stock > 0 && product.stock <= 50;
              const CategoryIcon = getCategoryIcon(product.category);

              return (
                <div
                  key={product._id}
                  className={`relative p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all group ${
                    darkMode
                      ? "bg-[#16201c] border-[#26332d] hover:border-[#3a4d44]"
                      : "bg-white border-gray-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  {isOutOfStock && (
                    <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400">
                      <AlertTriangle size={10} /> স্টক আউট!
                    </span>
                  )}
                  {isLowStock && (
                    <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                      <AlertTriangle size={10} /> স্টক সীমিত!
                    </span>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div
                          className={`w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center ${
                            darkMode
                              ? "bg-[#8cc655]/10 text-[#9ece6a]"
                              : "bg-[#316312]/10 text-[#316312]"
                          }`}
                        >
                          <CategoryIcon size={20} />
                        </div>
                      )}
                      <div>
                        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {product.category}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base leading-tight mt-0.5">
                          {product.name}
                        </h3>
                      </div>
                    </div>

                    <hr className="border-gray-100 dark:border-gray-800/50" />

                    <div className="grid grid-cols-2 gap-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                      <div className="space-y-1">
                        <span className="text-[9px] sm:text-[10px] uppercase text-gray-400">
                          মূল্য / দর
                        </span>
                        <p
                          className={`text-sm font-black ${
                            darkMode ? "text-[#9ece6a]" : "text-emerald-800"
                          }`}
                        >
                          ৳{product.price} / {product.unit}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] sm:text-[10px] uppercase text-gray-400">
                          অবশিষ্ট স্টক
                        </span>
                        <p
                          className={`text-sm font-black ${
                            isOutOfStock
                              ? "text-red-500"
                              : isLowStock
                              ? "text-amber-500"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {product.stock} {product.unit}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Sales bar */}
                  <div className="mt-4 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 text-xs flex items-center justify-between font-semibold">
                    <span className="text-gray-400 flex items-center gap-1">
                      <TrendingUp size={12} /> মোট বিক্রি:
                    </span>
                    <span className={darkMode ? "text-[#9ece6a]" : "text-emerald-800"}>
                      {product.sales} {product.unit}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800/50">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setEditName(product.name);
                        setEditCategory(product.category);
                        setEditUnit(product.unit);
                        setEditStock(product.stock.toString());
                        setEditPrice(product.price.toString());
                      }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
                        darkMode
                          ? "border-[#26332d] bg-[#1B2420]/50 hover:bg-[#1B2420] text-gray-300"
                          : "border-gray-200 bg-gray-50/50 hover:bg-gray-100 text-slate-700"
                      }`}
                    >
                      <Edit3 size={13} /> দ্রুত আপডেট
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product._id)}
                      className="p-2 rounded-xl border border-red-200 hover:border-red-300 dark:border-red-950/40 dark:hover:border-red-900/60 bg-red-50 hover:bg-red-100/50 dark:bg-red-950/10 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 cursor-pointer transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 text-sm text-gray-400 font-medium">
              {searchQuery
                ? "কোনো পণ্য পাওয়া যায়নি!"
                : "এখনো কোনো পণ্য যোগ করা হয়নি। প্রথম পণ্যটি যোগ করুন!"}
            </div>
          )}
        </div>
      )}

      {/* Quick Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-sm rounded-2xl border p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150 ${
              darkMode
                ? "bg-[#16201c] border-[#26332d] text-gray-200"
                : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            <div className="flex justify-between items-center border-b border-inherit pb-2">
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Package
                  size={15}
                  className={darkMode ? "text-[#9ece6a]" : "text-emerald-800"}
                />
                পণ্য আপডেট করুন
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-400"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveQuickEdit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400">
                  পণ্যের নাম
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className={inputCls}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400">
                  ক্যাটাগরি
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className={inputCls}
                >
                  <option value="শাক-সবজি">শাক-সবজি</option>
                  <option value="ধান ও চাল">ধান ও চাল</option>
                  <option value="মৌসুমি ফল">মৌসুমি ফল</option>
                  <option value="ডাল ও শস্য">ডাল ও শস্য</option>
                  <option value="খাঁটি মশলা">খাঁটি মশলা</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400">
                  পরিমাপের একক
                </label>
                <select
                  value={editUnit}
                  onChange={(e) => setEditUnit(e.target.value)}
                  className={inputCls}
                >
                  <option value="প্রতি কেজি">প্রতি কেজি</option>
                  <option value="প্রতি মন">প্রতি মন</option>
                  <option value="প্রতি gram">প্রতি গ্রাম</option>
                  <option value="প্রতি পিস">প্রতি পিস</option>
                  <option value="প্রতি লিটার">প্রতি লিটার</option>
                  <option value="প্রতি আঁটি">প্রতি আঁটি</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400">
                  বিক্রয় মূল্য (৳)
                </label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  required
                  min="1"
                  className={inputCls}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400">
                  স্টক পরিমাণ ({editUnit})
                </label>
                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  required
                  min="0"
                  className={inputCls}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border cursor-pointer transition-colors ${
                    darkMode
                      ? "border-[#26332d] hover:bg-[#1B2420] text-gray-400"
                      : "border-gray-200 hover:bg-gray-50 text-gray-500"
                  }`}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all active:scale-95 ${
                    darkMode
                      ? "bg-[#8cc655] hover:bg-[#9ece6a] text-[#111a17]"
                      : "bg-[#316312] hover:bg-emerald-800 text-white"
                  } ${saving ? "opacity-75 cursor-wait" : ""}`}
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  আপডেট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-sm rounded-2xl border p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150 ${
              darkMode
                ? "bg-[#16201c] border-[#26332d] text-gray-200"
                : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            <div className="flex justify-between items-center border-b border-inherit pb-2">
              <h3 className="font-bold text-sm flex items-center gap-1.5 text-red-600">
                <AlertTriangle size={15} />
                পণ্য মুছে ফেলুন
              </h3>
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-gray-400"
              >
                <X size={16} />
              </button>
            </div>
            
            <p className="text-sm leading-relaxed">
              আপনি কি নিশ্চিতভাবে এই পণ্যটি মুছে ফেলতে চান? এই কাজটি আর পূর্বাবস্থায় ফেরানো যাবে না।
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border cursor-pointer transition-colors ${
                  darkMode
                    ? "border-[#26332d] hover:bg-[#1B2420] text-gray-400"
                    : "border-gray-200 hover:bg-gray-50 text-gray-500"
                }`}
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1"
              >
                <Trash2 size={13} />
                মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;