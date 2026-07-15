"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { HarvestLoader } from "@/Components/loading";
import { 
  LayoutDashboard, 
  PlusCircle, 
  ShoppingBag, 
  FileText, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon,
  LogOut,
  Sprout,
  LucideIcon,
  Home
} from "lucide-react";

interface MenuItem {
  path: string;
  name: string;
  icon: LucideIcon;
}

interface FarmerLayoutProps {
  children: React.ReactNode;
}

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const FarmerLayout: React.FC<FarmerLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/auth");
    } else if (session.user.role !== "Farmer") {
      router.push("/unauthorized");
    }
  }, [session, isPending, router]);

  const darkMode = mounted && theme === "dark";

  const toggleSidebar = (): void => setIsOpen(!isOpen);
  const toggleTheme = (): void => setTheme(darkMode ? "light" : "dark");

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/auth");
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/auth";
    }
  };

  const menuItems: MenuItem[] = [
    { path: "/dashboard/farmer", name: "ড্যাশবোর্ড হোম", icon: LayoutDashboard },
    { path: "/dashboard/farmer/add-item", name: "পণ্য যোগ করুন", icon: PlusCircle },
    { path: "/dashboard/farmer/my-item", name: "আমার পণ্যসমূহ", icon: ShoppingBag },
    { path: "/dashboard/farmer/order-track", name: "অর্ডার ট্র্যাকিং", icon: FileText },
    { path: "/dashboard/farmer/profile", name: "প্রোফাইল সেটিংস", icon: User },
  ];

  if (isPending) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#faf9f5] dark:bg-[#111a17]">
        <HarvestLoader variant="fallback" />
      </div>
    );
  }

  if (!session?.user || session.user.role !== "Farmer") {
    return null;
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${
      darkMode ? "bg-[#111a17] text-gray-200" : "bg-[#fafcfb] text-emerald-950"
    }`}>
      
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 lg:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform flex flex-col justify-between
        border-r transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
        ${darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-[#f5f4f0] border-[#e6e2d8]"}
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div>
          {/* Logo Section */}
          <div className="flex items-center justify-between p-5 border-b border-inherit">
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <div className={`p-2 rounded-xl text-white flex-shrink-0 ${darkMode ? "bg-[#8cc655]" : "bg-[#316312]"}`}>
                <Sprout size={22} className={darkMode ? "text-[#111a17]" : "text-white"} />
              </div>
              <span className={`font-bold text-base sm:text-lg tracking-tight truncate ${darkMode ? "text-[#9ece6a]" : "text-emerald-800"}`}>
                ফসলবাড়ি ফার্মার
              </span>
            </Link>
            <button onClick={toggleSidebar} className="lg:hidden p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 group ${
                    isActive
                      ? darkMode
                        ? "bg-[#8cc655]/15 text-[#9ece6a]"
                        : "bg-emerald-100 text-emerald-800"
                      : darkMode
                      ? "hover:bg-[#1B2420] text-gray-400 hover:text-gray-200"
                      : "hover:bg-white text-emerald-950/70 hover:text-emerald-800"
                  }`}
                >
                  <Icon size={18} className={`${isActive ? (darkMode ? "text-[#9ece6a]" : "text-emerald-800") : "text-gray-400 group-hover:text-gray-500"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-inherit space-y-2">
          <Link
            href="/"
            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              darkMode
                ? "text-gray-400 hover:bg-[#1B2420] hover:text-gray-200"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Home size={18} />
            মূল হোম পেজ
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
          >
            <LogOut size={18} />
            লগ আউট
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto overflow-x-hidden">
        {/* Mobile Header */}
        <header className={`lg:hidden flex items-center justify-between p-4 border-b ${
          darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-[#f5f4f0] border-[#e6e2d8]"
        }`}>
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
            <Menu size={20} />
          </button>
          <span className={`font-bold text-lg ${darkMode ? "text-[#9ece6a]" : "text-emerald-800"}`}>ফসলবাড়ি</span>
          <div className="w-8 h-8 rounded-full bg-[#316312] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            কৃ
          </div>
        </header>

        {/* Content Children */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FarmerLayout;