"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sprout, Sun, Moon, User } from "lucide-react";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, 
    () => false
  );
}
// --------------------------------------------------------

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();
  const pathname = usePathname();

  const darkMode = mounted && theme === "dark";

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

          {/* User login */}
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
        </div>
      </div>
    </div>
  );
};

export default Navbar;