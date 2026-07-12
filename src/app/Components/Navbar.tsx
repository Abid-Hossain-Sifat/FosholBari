"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sprout, Sun, Moon, User, ChevronDown, LayoutDashboard, LogOut, Shield } from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, 
    () => false
  );
}

const getInitials = (name?: string | null) => {
  if (!name) return "U";
  const trimmed = name.trim();
  if (!trimmed) return "U";
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
};

// --------------------------------------------------------

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const pathname = usePathname();

  const darkMode = mounted && theme === "dark";

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const { data: session } = authClient.useSession();

  const toggleTheme = () => {
    setTheme(darkMode ? "light" : "dark");
  };

  const navLinks = [
    { name: "হোম", href: "/" },
    { name: "এক্সপ্লোর", href: "/explore" },
    { name: "আমাদের সম্পর্কে", href: "/about" },
    { name: "যোগাযোগ", href: "/contact" },
  ];

  return (
    <div
      className={`w-full border-b transition-colors duration-300 ${
        darkMode
          ? "bg-[#1B2420] text-gray-300 border-[#26332d]"
          : "bg-[#faf9f5] text-emerald-950 border-gray-200"
      }`}
    >
      <div className="max-w-[80%] mx-auto h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl cursor-pointer selection:bg-transparent"
        >
          <Sprout
            className={`w-6 h-6 ${
              darkMode ? "text-[#9ece6a]" : "text-emerald-800"
            }`}
          />
          <span className={darkMode ? "text-[#9ece6a]" : "text-emerald-800"}>
            ফসলবাড়ি
          </span>
        </Link>

        {/* Middle / Links */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors duration-200 ${
                  isActive
                    ? darkMode
                      ? "text-[#9ece6a] font-semibold"
                      : "text-emerald-800 font-semibold"
                    : darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-emerald-950/70 hover:text-emerald-500"
                }`}
              >
                {link.name}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[2px] rounded-full ${
                      darkMode ? "bg-[#9ece6a]" : "bg-emerald-800"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right / Actions */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all duration-200 ${
              darkMode
                ? "border-[#26332d] hover:bg-[#26332d] text-gray-300"
                : "border-gray-300 hover:bg-gray-100 text-slate-700"
            }`}
            aria-label="Toggle Theme"
          >
            {mounted ? (
              darkMode ? (
                <Sun className="w-5 h-5 text-[#9ece6a]" />
              ) : (
                <Moon className="w-5 h-5" />
              )
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* User profile / login */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 cursor-pointer focus:outline-none select-none hover:opacity-90 transition-opacity"
              >
                {/* Larger Avatar Circle */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700 flex items-center justify-center bg-[#316312] dark:bg-[#8cc655] shadow-sm">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      fill
                      sizes="40px"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <span className="text-white dark:text-[#111a17] font-bold text-sm tracking-wider">
                      {getInitials(session.user.name)}
                    </span>
                  )}
                </div>

                {/* Larger Name & Subtitle */}
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className={`text-sm lg:text-base font-bold ${darkMode ? "text-gray-200" : "text-emerald-950"}`}>
                    {session.user.name}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {session.user.role === "Farmer" ? "কৃষক" : "ক্রেতা"}
                  </span>
                </div>

                {/* Chevron icon indicating dropdown */}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""} ${darkMode ? "text-gray-400" : "text-emerald-950/70"}`} />
              </button>

              {dropdownOpen && (
                <>
                  {/* Dropdown Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  {/* Upgraded Dropdown Card */}
                  <div
                    className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl border z-50 py-3 transition-all duration-200 ${
                      darkMode
                        ? "bg-[#16201c] border-[#2c3d36] text-gray-200 shadow-black/60"
                        : "bg-white border-[#e6e2d8] text-gray-800 shadow-[#316312]/10"
                    }`}
                  >
                    <div className="px-4 py-2 mb-2 border-b border-gray-150 dark:border-gray-800/80 pb-3">
                      <p className={`font-bold text-sm truncate ${darkMode ? "text-white" : "text-emerald-950"}`}>
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                        {session.user.email}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#316312]/10 dark:bg-[#8cc655]/10 text-[#316312] dark:text-[#8cc655]">
                        <Shield className="w-3 h-3" />
                        {session.user.role === "Farmer" ? "কৃষক (Farmer)" : "ক্রেতা (Buyer)"}
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors ${
                        darkMode
                          ? "hover:bg-[#202f2a] hover:text-[#8cc655]"
                          : "hover:bg-emerald-50 hover:text-[#316312]"
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      ড্যাশবোর্ড (Dashboard)
                    </Link>

                    <button
                      onClick={async () => {
                        setDropdownOpen(false);
                        await authClient.signOut();
                        window.location.href = "/auth";
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors text-red-600 dark:text-red-400 cursor-pointer ${
                        darkMode
                          ? "hover:bg-red-950/20"
                          : "hover:bg-red-50"
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      লগ আউট (Log Out)
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/auth" aria-label="User Profile">
              <div
                className={`p-2 rounded-full border transition-all duration-200 ${
                  darkMode
                    ? "border-[#26332d] hover:bg-[#26332d] text-gray-300"
                    : "border-gray-300 hover:bg-gray-100 text-slate-700"
                }`}
              >
                <User className="w-5 h-5" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;