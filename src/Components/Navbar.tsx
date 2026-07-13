"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Sprout, Sun, Moon, User, ChevronDown,
  LayoutDashboard, LogOut, Shield, Menu, X,
} from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const getInitials = (name?: string | null) => {
  if (!name) return "U";
  const trimmed = name.trim();
  if (!trimmed) return "U";
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
};

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const pathname = usePathname();

  const darkMode = mounted && theme === "dark";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const toggleTheme = () => setTheme(darkMode ? "light" : "dark");

  // Close mobile menu on route change
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMobileMenuOpen(false);
      setDropdownOpen(false);
    });
    return () => cancelAnimationFrame(handle);
  }, [pathname]);

  const navLinks = [
    { name: "হোম", href: "/" },
    { name: "এক্সপ্লোর", href: "/explore" },
    { name: "আমাদের সম্পর্কে", href: "/about" },
    { name: "যোগাযোগ", href: "/contact" },
  ];

  return (
    <>
      <div
        className={`w-full border-b transition-colors duration-300 ${
          darkMode
            ? "bg-[#1B2420] text-gray-300 border-[#26332d]"
            : "bg-[#faf9f5] text-emerald-950 border-gray-200"
        }`}
      >
        <div className="max-w-[90%] lg:max-w-[80%] mx-auto h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl cursor-pointer select-none"
          >
            <Sprout className={`w-6 h-6 ${darkMode ? "text-[#9ece6a]" : "text-emerald-800"}`} />
            <span className={darkMode ? "text-[#9ece6a]" : "text-emerald-800"}>ফসলবাড়ি</span>
          </Link>

          {/* ── Desktop nav links (lg only) ── */}
          <div className="hidden lg:flex items-center gap-8 font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 transition-colors duration-200 ${
                    isActive
                      ? darkMode ? "text-[#9ece6a] font-semibold" : "text-emerald-800 font-semibold"
                      : darkMode ? "text-gray-400 hover:text-gray-200" : "text-emerald-950/70 hover:text-emerald-500"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className={`absolute bottom-0 left-0 w-full h-[2px] rounded-full ${darkMode ? "bg-[#9ece6a]" : "bg-emerald-800"}`} />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Right side actions ── */}
          <div className="flex items-center gap-3">

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
                darkMode ? <Sun className="w-5 h-5 text-[#9ece6a]" /> : <Moon className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* ── Desktop: User profile / login ── */}
            <div className="hidden lg:block">
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 cursor-pointer focus:outline-none select-none hover:opacity-90 transition-opacity"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700 flex items-center justify-center bg-[#316312] dark:bg-[#8cc655] shadow-sm">
                      {session.user.image ? (
                        <Image src={session.user.image} alt={session.user.name || "User"} fill sizes="40px" className="object-cover" priority />
                      ) : (
                        <span className="text-white dark:text-[#111a17] font-bold text-sm tracking-wider">
                          {getInitials(session.user.name)}
                        </span>
                      )}
                    </div>
                    <div className="hidden sm:flex flex-col items-start leading-tight">
                      <span className={`text-sm lg:text-base font-bold ${darkMode ? "text-gray-200" : "text-emerald-950"}`}>
                        {session.user.name}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        {session.user.role === "Admin" ? "অ্যাডমিন" : session.user.role === "Farmer" ? "কৃষক" : "ক্রেতা"}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""} ${darkMode ? "text-gray-400" : "text-emerald-950/70"}`} />
                  </button>

                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                      <div className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl border z-50 py-3 transition-all duration-200 ${
                        darkMode
                          ? "bg-[#16201c] border-[#2c3d36] text-gray-200 shadow-black/60"
                          : "bg-white border-[#e6e2d8] text-gray-800 shadow-[#316312]/10"
                      }`}>
                        <div className="px-4 py-2 mb-2 border-b border-gray-150 dark:border-gray-800/80 pb-3">
                          <p className={`font-bold text-sm truncate ${darkMode ? "text-white" : "text-emerald-950"}`}>{session.user.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">{session.user.email}</p>
                          <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#316312]/10 dark:bg-[#8cc655]/10 text-[#316312] dark:text-[#8cc655]">
                            <Shield className="w-3 h-3" />
                            {session.user.role === "Admin" ? "অ্যাডমিন (Admin)" : session.user.role === "Farmer" ? "কৃষক (Farmer)" : "ক্রেতা (Buyer)"}
                          </span>
                        </div>
                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors ${darkMode ? "hover:bg-[#202f2a] hover:text-[#8cc655]" : "hover:bg-emerald-50 hover:text-[#316312]"}`}>
                          <LayoutDashboard className="w-4 h-4" /> ড্যাশবোর্ড (Dashboard)
                        </Link>
                        <button
                          onClick={async () => { setDropdownOpen(false); await authClient.signOut(); window.location.href = "/auth"; }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors text-red-600 dark:text-red-400 cursor-pointer ${darkMode ? "hover:bg-red-950/20" : "hover:bg-red-50"}`}>
                          <LogOut className="w-4 h-4" /> লগ আউট (Log Out)
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link href="/auth" aria-label="User Profile">
                  <div className={`p-2 rounded-full border transition-all duration-200 ${darkMode ? "border-[#26332d] hover:bg-[#26332d] text-gray-300" : "border-gray-300 hover:bg-gray-100 text-slate-700"}`}>
                    <User className="w-5 h-5" />
                  </div>
                </Link>
              )}
            </div>

            {/* ── Hamburger (sm & md only) ── */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-full border transition-all duration-200 ${
                darkMode
                  ? "border-[#26332d] hover:bg-[#26332d] text-gray-300"
                  : "border-gray-300 hover:bg-gray-100 text-slate-700"
              }`}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu (sm & md) ── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className={`border-t px-6 py-4 flex flex-col gap-1 ${
            darkMode ? "border-[#26332d] bg-[#16201c]" : "border-gray-200 bg-[#f5f4f0]"
          }`}>

            {/* Nav links */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? darkMode
                        ? "bg-[#9ece6a]/10 text-[#9ece6a]"
                        : "bg-emerald-100 text-emerald-800"
                      : darkMode
                      ? "text-gray-400 hover:bg-[#1B2420] hover:text-gray-200"
                      : "text-emerald-950/70 hover:bg-white hover:text-emerald-700"
                  }`}
                >
                  {isActive && (
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${darkMode ? "bg-[#9ece6a]" : "bg-emerald-700"}`} />
                  )}
                  {link.name}
                </Link>
              );
            })}

            {/* Divider */}
            <div className={`my-2 h-px ${darkMode ? "bg-[#26332d]" : "bg-gray-200"}`} />

            {/* User section */}
            {session ? (
              <div className="flex flex-col gap-1">
                {/* User info card */}
                <div className={`flex items-center gap-3 px-3 py-3 rounded-xl ${darkMode ? "bg-[#1B2420]" : "bg-white"}`}>
                  <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700 flex items-center justify-center bg-[#316312] dark:bg-[#8cc655] shadow-sm">
                    {session.user.image ? (
                      <Image src={session.user.image} alt={session.user.name || "User"} fill sizes="40px" className="object-cover" />
                    ) : (
                      <span className="text-white dark:text-[#111a17] font-bold text-sm">{getInitials(session.user.name)}</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-bold truncate ${darkMode ? "text-gray-200" : "text-emerald-950"}`}>{session.user.name}</span>
                    <span className="text-xs text-gray-400 truncate">{session.user.email}</span>
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-[#316312] dark:text-[#8cc655]">
                      <Shield className="w-3 h-3" />
                      {session.user.role === "Admin" ? "অ্যাডমিন (Admin)" : session.user.role === "Farmer" ? "কৃষক (Farmer)" : "ক্রেতা (Buyer)"}
                    </span>
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    darkMode ? "text-gray-300 hover:bg-[#1B2420] hover:text-[#8cc655]" : "text-gray-700 hover:bg-white hover:text-[#316312]"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> ড্যাশবোর্ড (Dashboard)
                </Link>

                <button
                  onClick={async () => { setMobileMenuOpen(false); await authClient.signOut(); window.location.href = "/auth"; }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors text-red-500 dark:text-red-400 ${
                    darkMode ? "hover:bg-red-950/20" : "hover:bg-red-50"
                  }`}
                >
                  <LogOut className="w-4 h-4" /> লগ আউট (Log Out)
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  darkMode
                    ? "text-gray-300 hover:bg-[#1B2420] hover:text-[#9ece6a]"
                    : "text-gray-700 hover:bg-white hover:text-emerald-700"
                }`}
              >
                <User className="w-4 h-4" /> লগইন / রেজিস্ট্রেশন
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;