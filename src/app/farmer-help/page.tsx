"use client";

import React, { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sprout,
  Truck,
  Wallet,
  ShieldCheck,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  PlayCircle,
  ArrowRight,
} from "lucide-react";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface HelpTopic {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  articleCount: number;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Guide {
  id: string;
  title: string;
  duration: string;
  category: string;
}

const helpTopics: HelpTopic[] = [
  {
    id: "listing",
    icon: Sprout,
    title: "পণ্য তালিকাভুক্তি",
    description: "কীভাবে ফসল পোস্ট করবেন ও ছবি, দাম যোগ করবেন",
    articleCount: 8,
  },
  {
    id: "delivery",
    icon: Truck,
    title: "ডেলিভারি ও পরিবহন",
    description: "অর্ডার প্যাকিং, পিকআপ ও ডেলিভারি ট্র্যাকিং",
    articleCount: 6,
  },
  {
    id: "payment",
    icon: Wallet,
    title: "পেমেন্ট ও টাকা তোলা",
    description: "বিকাশ, নগদ ও ব্যাংকে টাকা পাওয়ার নিয়ম",
    articleCount: 5,
  },
  {
    id: "verification",
    icon: ShieldCheck,
    title: "অ্যাকাউন্ট যাচাই",
    description: "NID যাচাই ও কৃষক ব্যাজ পাওয়ার প্রক্রিয়া",
    articleCount: 4,
  },
];

const faqs: FAQItem[] = [
  {
    id: "f1",
    category: "পণ্য তালিকাভুক্তি",
    question: "আমি কীভাবে নতুন ফসল পোস্ট করব?",
    answer:
      "হোমপেজের উপরে 'পণ্য যোগ করুন' বাটনে চাপ দিন। এরপর ফসলের নাম, পরিমাণ, দাম এবং কমপক্ষে একটি ছবি যোগ করে 'পোস্ট করুন' চাপলেই আপনার পণ্য ক্রেতাদের কাছে দৃশ্যমান হবে।",
  },
  {
    id: "f2",
    category: "পেমেন্ট ও টাকা তোলা",
    question: "বিক্রির টাকা পেতে কত সময় লাগে?",
    answer:
      "ক্রেতা পণ্য গ্রহণ নিশ্চিত করার পর সাধারণত ২৪ থেকে ৪৮ ঘণ্টার মধ্যে আপনার বিকাশ, নগদ বা ব্যাংক অ্যাকাউন্টে টাকা জমা হয়ে যায়।",
  },
  {
    id: "f3",
    category: "ডেলিভারি ও পরিবহন",
    question: "ক্রেতা যদি পণ্য গ্রহণ না করে তাহলে কী হবে?",
    answer:
      "এমন হলে আমাদের সাপোর্ট টিমকে জানান। আমরা ক্রেতার সাথে যোগাযোগ করে সমাধান করি অথবা পণ্যটি অন্য নিকটবর্তী ক্রেতার কাছে পুনরায় তালিকাভুক্ত করতে সাহায্য করি।",
  },
  {
    id: "f4",
    category: "অ্যাকাউন্ট যাচাই",
    question: "কৃষক হিসেবে ভেরিফাই হতে কী কী লাগবে?",
    answer:
      "আপনার জাতীয় পরিচয়পত্র (NID), একটি সচল মোবাইল নম্বর এবং আপনার জমি বা খামারের একটি ছবি দিতে হবে। যাচাই সম্পন্ন হতে সাধারণত ১-২ কার্যদিবস সময় লাগে।",
  },
  {
    id: "f5",
    category: "পণ্য তালিকাভুক্তি",
    question: "একসাথে কয়টি পণ্য পোস্ট করা যাবে?",
    answer:
      "একজন যাচাইকৃত কৃষক একই সময়ে সর্বোচ্চ ২০টি সক্রিয় পণ্য পোস্ট রাখতে পারবেন। পুরনো বা বিক্রি হয়ে যাওয়া পণ্য মুছে ফেললে নতুন পণ্যের জন্য জায়গা তৈরি হয়।",
  },
  {
    id: "f6",
    category: "ডেলিভারি ও পরিবহন",
    question: "আমি কি নিজে ডেলিভারি দিতে পারব?",
    answer:
      "হ্যাঁ। পণ্য পোস্ট করার সময় 'নিজে ডেলিভারি' অপশনটি বেছে নিলে আপনি সরাসরি ক্রেতার কাছে পণ্য পৌঁছে দিতে পারবেন, অথবা আমাদের পার্টনার পরিবহন সেবাও ব্যবহার করতে পারেন।",
  },
];

const guides: Guide[] = [
  { id: "g1", title: "প্রথমবার পণ্য পোস্ট করার সম্পূর্ণ গাইড", duration: "৪ মিনিট", category: "শুরু করুন" },
  { id: "g2", title: "ভালো দামে বিক্রির জন্য ছবি তোলার কৌশল", duration: "৬ মিনিট", category: "বিক্রয় টিপস" },
  { id: "g3", title: "বিকাশ থেকে টাকা তোলার নিয়ম", duration: "৩ মিনিট", category: "পেমেন্ট" },
];

const categoryFilters = ["সব", "পণ্য তালিকাভুক্তি", "পেমেন্ট ও টাকা তোলা", "ডেলিভারি ও পরিবহন", "অ্যাকাউন্ট যাচাই"];

const FamerHelpPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("সব");
  const [openFaqId, setOpenFaqId] = useState<string | null>("f1");

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "সব" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className={`w-full min-h-screen py-12 transition-colors duration-300 ${
        darkMode ? "bg-[#1B2420]" : "bg-[#faf9f5]"
      }`}
    >
      <div className="max-w-[92%] sm:max-w-[88%] md:max-w-[85%] lg:max-w-[80%] mx-auto flex flex-col gap-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center text-center gap-4 py-6"
        >
          <span
            className={`text-xs font-semibold tracking-wide px-3 py-1 rounded-full ${
              darkMode ? "bg-[#9ece6a]/10 text-[#9ece6a]" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            কৃষক সহায়তা কেন্দ্র
          </span>
          <h2
            className={`text-2xl sm:text-4xl font-bold ${
              darkMode ? "text-[#9ece6a]" : "text-emerald-800"
            }`}
          >
            আপনাকে কীভাবে সাহায্য করতে পারি?
          </h2>
          <p className={`text-sm sm:text-base max-w-xl ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            পণ্য পোস্ট করা, পেমেন্ট, ডেলিভারি বা অ্যাকাউন্ট সংক্রান্ত যেকোনো প্রশ্নের উত্তর খুঁজুন,
            অথবা সরাসরি আমাদের টিমের সাথে যোগাযোগ করুন।
          </p>

          {/* Search */}
          <div className="w-full max-w-lg mt-2 relative">
            <Search
              className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="যেমন: টাকা তোলার নিয়ম, ছবি আপলোড..."
              className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border transition-colors ${
                darkMode
                  ? "bg-[#16201c] border-[#26332d] text-gray-200 placeholder:text-gray-500 focus:border-[#9ece6a]/50"
                  : "bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-emerald-300"
              }`}
            />
          </div>
        </motion.div>

        {/* Help topics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {helpTopics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
                onClick={() => setActiveCategory(topic.title)}
                className={`text-left rounded-2xl border p-5 flex flex-col gap-3 transition-colors duration-300 ${
                  darkMode
                    ? "bg-[#16201c] border-[#26332d] hover:border-[#9ece6a]/40"
                    : "bg-white border-gray-200 hover:border-emerald-300"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                    darkMode ? "bg-[#9ece6a]/10 text-[#9ece6a]" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className={`text-sm font-bold ${darkMode ? "text-gray-100" : "text-emerald-950"}`}>
                    {topic.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {topic.description}
                  </p>
                </div>
                <span className={`text-xs font-semibold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {topic.articleCount.toLocaleString("bn-BD")}টি সহায়ক নিবন্ধ
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Video guides */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col gap-4"
        >
          <h3 className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-emerald-950"}`}>
            শুরুর জন্য ভিডিও গাইড
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className={`rounded-2xl border p-4 flex items-center gap-3 transition-colors duration-300 ${
                  darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"
                }`}
              >
                <PlayCircle
                  className={`w-9 h-9 flex-shrink-0 ${darkMode ? "text-[#9ece6a]" : "text-emerald-600"}`}
                />
                <div className="flex flex-col gap-1 min-w-0">
                  <span className={`text-xs font-semibold ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {guide.category} · {guide.duration}
                  </span>
                  <span
                    className={`text-sm font-bold leading-snug truncate ${
                      darkMode ? "text-gray-100" : "text-emerald-950"
                    }`}
                  >
                    {guide.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col gap-4"
        >
          <h3 className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-emerald-950"}`}>
            সচরাচর জিজ্ঞাসা
          </h3>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categoryFilters.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  activeCategory === cat
                    ? darkMode
                      ? "bg-[#9ece6a] text-[#16201c] border-[#9ece6a]"
                      : "bg-emerald-700 text-white border-emerald-700"
                    : darkMode
                    ? "border-[#26332d] text-gray-400 hover:border-[#9ece6a]/40"
                    : "border-gray-200 text-gray-600 hover:border-emerald-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ list */}
          <div
            className={`rounded-2xl border divide-y transition-colors duration-300 ${
              darkMode ? "bg-[#16201c] border-[#26332d] divide-[#26332d]" : "bg-white border-gray-200 divide-gray-200"
            }`}
          >
            {filteredFaqs.length === 0 ? (
              <div className={`text-center py-16 text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                কোনো ফলাফল পাওয়া যায়নি। ভিন্ন শব্দ দিয়ে খুঁজে দেখুন।
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div key={faq.id} className="px-5 sm:px-6">
                    <button
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between gap-3 py-4 text-left"
                    >
                      <span className={`text-sm font-bold ${darkMode ? "text-gray-100" : "text-emerald-950"}`}>
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        } ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <p
                            className={`text-sm leading-relaxed pb-4 ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Contact support */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`rounded-2xl border p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors duration-300 ${
            darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex flex-col gap-2">
            <h3 className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-emerald-950"}`}>
              উত্তর খুঁজে পাননি?
            </h3>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              আমাদের সাপোর্ট টিম প্রতিদিন সকাল ৯টা থেকে রাত ৯টা পর্যন্ত আপনার পাশে আছে।
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-1">
              <span className={`flex items-center gap-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <Phone className="w-4 h-4" />
                +৮৮০ ১৭০০-০০০০০০
              </span>
              <span className={`flex items-center gap-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <Mail className="w-4 h-4" />
                support@fosholbari.com
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#316312] text-white text-sm font-semibold hover:bg-[#264d0e] transition-colors flex-shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            লাইভ চ্যাটে কথা বলুন
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default FamerHelpPage;