"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Sprout, Mail, MapPin, Phone } from "lucide-react";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const quickLinks = [
  { name: "হোম", href: "/" },
  { name: "এক্সপ্লোর", href: "/explore" },
  { name: "আমাদের সম্পর্কে", href: "/about" },
  { name: "যোগাযোগ", href: "/contact" },
];

const categoryLinks = [
  { name: "সবজি", href: "/explore?categories=শাক-সবজি" },
  { name: "ফল", href: "/explore?categories=ফলমূল" },
  { name: "দুগ্ধজাত", href: "/explore?categories=দুগ্ধজাত+পণ্য" },
  { name: "তেল ও মসলা", href: "/explore?categories=তেল+ও+মসলা" },
];

const socialLinks = [
  { name: "LinkedIn", href: "www.linkedin.com/in/abid-hossain-sifat", icon: FaLinkedinIn },
  { name: "GitHub", href: "https://github.com/Abid-Hossain-Sifat", icon: FaGithub },
  { name: "Email", href: "mailto:itzabid006@gmail.com", icon: Mail },
];

const Footer = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  return (
    <footer
      className={`w-full border-t transition-colors duration-300 ${
        darkMode
          ? "bg-[#16201c] border-[#26332d] text-gray-300"
          : "bg-[#f5f4f0] border-gray-200 text-emerald-950"
      }`}
    >
      <div className="max-w-[92%] sm:max-w-[88%] md:max-w-[85%] lg:max-w-[80%] mx-auto pt-12 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-start w-full">

          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-xs w-full">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl select-none">
              <Sprout className={`w-6 h-6 ${darkMode ? "text-[#9ece6a]" : "text-emerald-800"}`} />
              <span className={darkMode ? "text-[#9ece6a]" : "text-emerald-800"}>ফসলবাড়ি</span>
            </Link>
            <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              সরাসরি খামার থেকে আপনার হাতে — টাটকা, স্বাস্থ্যসম্মত এবং যাচাইকৃত পণ্য পৌঁছে দিতে আমরা প্রতিশ্রুতিবদ্ধ।
            </p>
            <div className="flex items-center gap-3 mt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 ${
                      darkMode
                        ? "border-[#26332d] text-gray-300 hover:bg-[#9ece6a]/10 hover:text-[#9ece6a] hover:border-[#9ece6a]/40"
                        : "border-gray-300 text-emerald-950 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-3 min-w-[150px]">
            <h4 className={`text-sm font-bold uppercase tracking-wide ${darkMode ? "text-gray-200" : "text-emerald-900"}`}>
              কুইক লিংক
            </h4>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm transition-colors duration-200 whitespace-nowrap ${
                      darkMode ? "text-gray-400 hover:text-[#9ece6a]" : "text-gray-600 hover:text-emerald-700"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-3 min-w-[150px]">
            <h4 className={`text-sm font-bold uppercase tracking-wide ${darkMode ? "text-gray-200" : "text-emerald-900"}`}>
              ক্যাটাগরি
            </h4>
            <ul className="flex flex-col gap-2">
              {categoryLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm transition-colors duration-200 whitespace-nowrap ${
                      darkMode ? "text-gray-400 hover:text-[#9ece6a]" : "text-gray-600 hover:text-emerald-700"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            <h4 className={`text-sm font-bold uppercase tracking-wide ${darkMode ? "text-gray-200" : "text-emerald-900"}`}>
              যোগাযোগ
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2">
                <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${darkMode ? "text-[#9ece6a]" : "text-emerald-700"}`} />
                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  ঢাকা, বাংলাদেশ
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className={`w-4 h-4 flex-shrink-0 ${darkMode ? "text-[#9ece6a]" : "text-emerald-700"}`} />
                <Link
                  href="tel:+8801700000000"
                  className={`text-sm transition-colors whitespace-nowrap ${
                    darkMode ? "text-gray-400 hover:text-[#9ece6a]" : "text-gray-600 hover:text-emerald-700"
                  }`}
                >
                  +৮৮০ ১৭০০-০০০০০০
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Mail className={`w-4 h-4 flex-shrink-0 ${darkMode ? "text-[#9ece6a]" : "text-emerald-700"}`} />
                <Link
                  href="mailto:support@fosholbari.com"
                  className={`text-sm transition-colors whitespace-nowrap ${
                    darkMode ? "text-gray-400 hover:text-[#9ece6a]" : "text-gray-600 hover:text-emerald-700"
                  }`}
                >
                  support@fosholbari.com
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className={`h-px my-8 ${darkMode ? "bg-[#26332d]" : "bg-gray-200"}`} />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className={`text-xs text-center sm:text-left ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
            &copy; {new Date().getFullYear()} ফসলবাড়ি। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className={`text-xs transition-colors ${
                darkMode ? "text-gray-500 hover:text-[#9ece6a]" : "text-gray-500 hover:text-emerald-700"
              }`}
            >
              প্রাইভেসি পলিসি
            </Link>
            <Link
              href="/terms"
              className={`text-xs transition-colors ${
                darkMode ? "text-gray-500 hover:text-[#9ece6a]" : "text-gray-500 hover:text-emerald-700"
              }`}
            >
              টার্মস অ্যান্ড কন্ডিশন
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;