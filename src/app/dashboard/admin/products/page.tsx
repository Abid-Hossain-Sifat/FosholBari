"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import {
  Trash2,
  Loader2,
  Search,
  Package,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { exploreCollection, deleteAnyProduct } from "@/lib/data";
import { toast } from "react-toastify";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const AdminProductsPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";
  const { data: session } = authClient.useSession();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await exploreCollection({ limit: 100 });
      setProducts(Array.isArray(data.data) ? data.data : []);
    } catch {
      toast.error("পণ্য তালিকা লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;
    loadProducts();
  }, [session?.user?.id]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`আপনি কি "${name}" পণ্যটি মুছতে চান?`)) return;
    try {
      await deleteAnyProduct(id);
      toast.success("পণ্য মুছে ফেলা হয়েছে।");
      loadProducts();
    } catch {
      toast.error("পণ্য মুছতে ব্যর্থ হয়েছে।");
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.farmerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? "text-white" : "text-emerald-950"}`}
          >
            পণ্য ব্যবস্থাপনা
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            মোট {products.length} টি পণ্য
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="পণ্য বা কৃষকের নামে খুঁজুন..."
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
            {searchTerm ? "কোনো পণ্য পাওয়া যায়নি।" : "কোনো পণ্য নেই।"}
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
                  <th className="p-4 pl-6">পণ্য</th>
                  <th className="p-4">ক্যাটাগরি</th>
                  <th className="p-4">মূল্য</th>
                  <th className="p-4">কৃষক</th>
                  <th className="p-4">স্টক</th>
                  <th className="p-4 pr-6 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs sm:text-sm ${darkMode ? "divide-[#2c3d36] text-gray-300" : "divide-gray-100 text-stone-700"}`}
              >
                {filtered.map((product: any) => (
                  <tr
                    key={product._id}
                    className={`transition-colors ${darkMode ? "hover:bg-[#1B2420]/40" : "hover:bg-stone-50/50"}`}
                  >
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            darkMode ? "bg-[#1B2420]" : "bg-stone-100"
                          }`}>
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <span className={`font-bold ${darkMode ? "text-white" : "text-stone-900"}`}>
                          {product.name || "অজ্ঞাত"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        darkMode ? "bg-[#1B2420] text-gray-300" : "bg-stone-100 text-stone-600"
                      }`}>
                        {product.category || "—"}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">
                      ৳{product.price?.toLocaleString("bn-BD") || "—"}
                    </td>
                    <td className="p-4 text-gray-400">{product.farmerName || "—"}</td>
                    <td className="p-4">
                      <span className={`font-semibold ${
                        product.stock === 0 ? "text-red-500" : darkMode ? "text-[#9ece6a]" : "text-emerald-600"
                      }`}>
                        {product.stock ?? "—"}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
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

export default AdminProductsPage;
