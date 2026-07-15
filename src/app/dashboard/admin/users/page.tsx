"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import {
  Trash2,
  Loader2,
  Search,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getAdminUsers, updateUserRole, deleteUser } from "@/lib/data";
import { toast } from "react-toastify";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const roleColors: Record<string, string> = {
  Admin: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  Farmer: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Buyer: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const AdminUsersPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";
  const { data: session } = authClient.useSession();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [changingRole, setChangingRole] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      toast.error("ব্যবহারকারী তালিকা লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) return;
    loadUsers();
  }, [session?.user?.id]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setChangingRole(userId);
    try {
      await updateUserRole(userId, newRole);
      toast.success("রোল আপডেট করা হয়েছে।");
      loadUsers();
    } catch (err: any) {
      toast.error(err.message || "রোল পরিবর্তন করতে ব্যর্থ হয়েছে।");
    } finally {
      setChangingRole(null);
    }
  };

  const handleDelete = async (userId: string, name: string) => {
    if (!window.confirm(`আপনি কি "${name}" কে মুছতে চান?`)) return;
    try {
      await deleteUser(userId);
      toast.success("ব্যবহারকারী মুছে ফেলা হয়েছে।");
      loadUsers();
    } catch {
      toast.error("ব্যবহারকারী মুছতে ব্যর্থ হয়েছে।");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? "text-white" : "text-emerald-950"}`}
          >
            ব্যবহারকারী ব্যবস্থাপনা
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            মোট {users.length} জন ব্যবহারকারী
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="নাম বা ইমেইল দ্বারা খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080]/30 ${
            darkMode
              ? "bg-[#16201c] border-[#2c3d36] text-gray-200 placeholder-gray-500"
              : "bg-white border-gray-200 text-stone-800 placeholder-gray-400"
          }`}
        />
      </div>

      {/* Users Table */}
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
            {searchTerm ? "কোনো ব্যবহারকারী পাওয়া যায়নি।" : "কোনো ব্যবহারকারী নেই।"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr
                  className={`text-xs font-bold border-b ${
                    darkMode
                      ? "bg-[#111a17] text-gray-400 border-[#2c3d36]"
                      : "bg-stone-50 text-stone-500 border-gray-200"
                  }`}
                >
                  <th className="p-4 pl-6">নাম</th>
                  <th className="p-4">ইমেইল</th>
                  <th className="p-4">রোল</th>
                  <th className="p-4">ফোন</th>
                  <th className="p-4 pr-6 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-xs sm:text-sm ${darkMode ? "divide-[#2c3d36] text-gray-300" : "divide-gray-100 text-stone-700"}`}
              >
                {filtered.map((user: any) => (
                  <tr
                    key={user._id}
                    className={`transition-colors ${darkMode ? "hover:bg-[#1B2420]/40" : "hover:bg-stone-50/50"}`}
                  >
                    <td
                      className={`p-4 pl-6 font-bold ${darkMode ? "text-white" : "text-stone-900"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            darkMode
                              ? "bg-[#8cc655]/10 text-[#8cc655]"
                              : "bg-[#008080]/10 text-[#008080]"
                          }`}
                        >
                          {user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        {user.name || "অজ্ঞাত"}
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">{user.email || "—"}</td>
                    <td className="p-4">
                      <div className="relative inline-block">
                        <select
                          value={user.role || "Buyer"}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          disabled={changingRole === user._id}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border appearance-none cursor-pointer focus:outline-none disabled:opacity-50 ${
                            roleColors[user.role || "Buyer"]
                          } ${
                            darkMode
                              ? "bg-[#111a17]"
                              : "bg-white"
                          }`}
                        >
                          <option value="Buyer">ক্রেতা</option>
                          <option value="Farmer">কৃষক</option>
                          <option value="Admin">অ্যাডমিন</option>
                        </select>
                        {changingRole === user._id && (
                          <Loader2 className="w-3 h-3 animate-spin absolute -right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">{user.phoneNumber || "—"}</td>
                    <td className="p-4 pr-6 text-center">
                      <button
                        onClick={() => handleDelete(user._id, user.name)}
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

export default AdminUsersPage;
