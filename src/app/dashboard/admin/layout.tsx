"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { HarvestLoader } from "@/Components/loading";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  FileText,
  Menu,
  X,
  LogOut,
  Sprout,
  Home,
  ClipboardList,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { theme } = useTheme();
  const mounted = useMounted();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/auth");
    } else if (session.user.role !== "Admin") {
      router.push("/unauthorized");
    }
  }, [session, isPending, router]);

  const darkMode = mounted && theme === "dark";

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/auth");
    } catch {
      window.location.href = "/auth";
    }
  };

  const menuItems = [
    { name: "ড্যাশবোর্ড", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "ব্যবহারকারী", href: "/dashboard/admin/users", icon: Users },
    { name: "পণ্যসমূহ", href: "/dashboard/admin/products", icon: ShoppingBag },
    { name: "অর্ডারসমূহ", href: "/dashboard/admin/orders", icon: ClipboardList },
    { name: "চাহিদা", href: "/dashboard/admin/demands", icon: FileText },
  ];

  if (isPending) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#faf9f5] dark:bg-[#111a17]">
        <HarvestLoader variant="fallback" />
      </div>
    );
  }

  if (!session?.user || session.user.role !== "Admin") {
    return null;
  }

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Logo */}
        <div className="p-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl select-none"
          >
            <Sprout
              className={`w-6 h-6 ${darkMode ? "text-[#9ece6a]" : "text-emerald-800"}`}
            />
            <span className={darkMode ? "text-[#9ece6a]" : "text-emerald-800"}>
              ফসলবাড়ি
            </span>
          </Link>
          <p className="text-[10px] text-gray-400 mt-1 font-semibold tracking-wider uppercase">
            অ্যাডমিন প্যানেল
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? darkMode
                      ? "bg-[#9ece6a]/10 text-[#9ece6a]"
                      : "bg-[#008080] text-white shadow-md shadow-[#008080]/10"
                    : darkMode
                      ? "text-gray-400 hover:bg-[#1B2420] hover:text-gray-200"
                      : "text-emerald-950/70 hover:bg-stone-100 hover:text-emerald-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div
        className={`p-4 border-t space-y-2 ${darkMode ? "border-[#26332d]" : "border-gray-200"}`}
      >
        <Link
          href="/"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors w-full ${
            darkMode
              ? "text-gray-400 hover:bg-[#1B2420] hover:text-gray-200"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <Home className="w-4 h-4" />
          মূল হোম পেজ
        </Link>

        <div
          className={`flex items-center justify-between p-3 rounded-xl border ${
            darkMode
              ? "bg-[#16201c] border-[#2c3d36]"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ${
                darkMode
                  ? "bg-[#8cc655]/10 text-[#8cc655]"
                  : "bg-[#008080]/10 text-[#008080]"
              }`}
            >
              {session?.user?.name ? session.user.name[0].toUpperCase() : "A"}
            </div>
            <div className="min-w-0">
              <h4
                className={`text-xs font-bold truncate ${darkMode ? "text-gray-200" : "text-stone-800"}`}
              >
                {session?.user?.name || "অ্যাডমিন"}
              </h4>
              <span className="text-[10px] text-gray-400 block">অ্যাডমিন</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors duration-300 ${
        darkMode
          ? "bg-[#1B2420] text-gray-300"
          : "bg-[#faf9f5] text-emerald-950"
      }`}
    >
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col w-64 border-r h-full flex-shrink-0 transition-colors duration-300 ${
          darkMode
            ? "bg-[#111a17] border-[#26332d]"
            : "bg-[#f5f4f0] border-gray-200"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Top Navbar */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 h-16 border-b flex items-center justify-between px-6 z-30 transition-colors duration-300 ${
          darkMode
            ? "bg-[#111a17] border-[#26332d]"
            : "bg-[#f5f4f0] border-gray-200"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 font-bold select-none">
          <Sprout
            className={`w-5 h-5 ${darkMode ? "text-[#9ece6a]" : "text-emerald-800"}`}
          />
          <span
            className={`text-lg ${darkMode ? "text-[#9ece6a]" : "text-emerald-800"}`}
          >
            ফসলবাড়ি
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`p-2 rounded-xl border transition-colors ${
            darkMode
              ? "border-[#26332d] bg-[#16201c] text-gray-300"
              : "border-gray-300 bg-white text-slate-700"
          }`}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className={`fixed top-16 bottom-0 left-0 w-64 border-r p-2 overflow-y-auto transition-transform duration-300 ${
              darkMode
                ? "bg-[#111a17] border-[#26332d]"
                : "bg-[#f5f4f0] border-gray-200"
            }`}
          >
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
