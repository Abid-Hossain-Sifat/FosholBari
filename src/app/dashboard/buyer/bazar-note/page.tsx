"use client";

import React, { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import * as Icons from "lucide-react";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

interface NoteItem {
  id: number;
  cropName: string;
  quantity: string;
  estimatedBudget: string;
  notes: string;
  isCompleted: boolean;
}

const NotePage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  const [notesList, setNotesList] = useState<NoteItem[]>([
    {
      id: 1,
      cropName: "দেশী রসুন",
      quantity: "৫০ কেজি",
      estimatedBudget: "৳ ৭,৫০০",
      notes: "শুকনো দেখে কিনতে হবে",
      isCompleted: false,
    },
    {
      id: 2,
      cropName: "কাঁচা মরিচ",
      quantity: "২০ কেজি",
      estimatedBudget: "৳ ২,৪০০",
      notes: "বেশি ঝাল ও তাজা মরিচ",
      isCompleted: true,
    },
    {
      id: 3,
      cropName: "ডায়মন্ড আলু",
      quantity: "৩০০ কেজি",
      estimatedBudget: "৳ ৯,০০০",
      notes: "বড় সাইজের আলু",
      isCompleted: false,
    },
  ]);

  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [budget, setBudget] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !quantity) return;

    const newNote: NoteItem = {
      id: Date.now(),
      cropName,
      quantity,
      estimatedBudget: budget
        ? `৳ ${Number(budget).toLocaleString("bn-BD")}`
        : "হিসেব নেই",
      notes: extraNotes || "কোনো নোট নেই",
      isCompleted: false,
    };

    setNotesList([newNote, ...notesList]);

    setCropName("");
    setQuantity("");
    setBudget("");
    setExtraNotes("");
  };

  const toggleComplete = (id: number) => {
    setNotesList(
      notesList.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item,
      ),
    );
  };

  const deleteNote = (id: number) => {
    setNotesList(notesList.filter((item) => item.id !== id));
  };

  const totalItems = notesList.length;
  const completedItems = notesList.filter((item) => item.isCompleted).length;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-3 sm:px-0">
      <div>
        <h1
          className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${darkMode ? "text-white" : "text-emerald-950"}`}
        >
          বাজার নোট
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
          বাজারে যাওয়ার আগে আপনার প্রয়োজনীয় ফসলের তালিকা তৈরি করুন
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-xl border flex items-center gap-4 ${darkMode ? "bg-[#16201c] border-[#2c3d36]" : "bg-white border-gray-200"}`}
        >
          <div
            className={`p-2.5 rounded-lg ${darkMode ? "bg-orange-500/10 text-orange-400" : "bg-orange-50 text-orange-600"}`}
          >
            <Icons.ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block">
              মোট আইটেম সংখ্যা
            </span>
            <span
              className={`text-lg font-bold ${darkMode ? "text-white" : "text-emerald-950"}`}
            >
              {totalItems} টি
            </span>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border flex items-center gap-4 ${darkMode ? "bg-[#16201c] border-[#2c3d36]" : "bg-white border-gray-200"}`}
        >
          <div
            className={`p-2.5 rounded-lg ${darkMode ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-600"}`}
          >
            <Icons.CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block">
              কেনা সম্পন্ন হয়েছে
            </span>
            <span
              className={`text-lg font-bold ${darkMode ? "text-white" : "text-emerald-950"}`}
            >
              {completedItems} টি
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">
        <div
          className={`p-4 sm:p-5 md:p-6 rounded-2xl border shadow-sm lg:col-span-1 ${
            darkMode
              ? "bg-[#16201c] border-[#2c3d36]"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-base sm:text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-emerald-950"}`}
          >
            <Icons.PenSquare className="w-5 h-5 text-[#008080] dark:text-[#9ece6a]" />
            নতুন নোট লিখুন
          </h2>

          <form onSubmit={handleAddNote} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                ফসলের নাম *
              </label>
              <input
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="উদা: দেশী রসুন, বোরো ধান"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  darkMode
                    ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                    : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">
                  পরিমাণ *
                </label>
                <input
                  type="text"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="উদা: ৫০ কেজি"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    darkMode
                      ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                      : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                  }`}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">
                  বাজেট (অপশনাল)
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="উদা: ৭৫০০"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    darkMode
                      ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                      : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                বিশেষ মনে রাখার নোট
              </label>
              <textarea
                rows={2}
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                placeholder="উদা: ভালো শুকনো দেখে নিতে হবে..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none ${
                  darkMode
                    ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                    : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                }`}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                darkMode
                  ? "bg-[#9ece6a] text-black hover:bg-[#8cc655]"
                  : "bg-[#008080] text-white hover:bg-emerald-700"
              }`}
            >
              <Icons.Plus className="w-4 h-4" /> নোটে যুক্ত করুন
            </button>
          </form>
        </div>

        <div
          className={`p-4 sm:p-5 md:p-6 rounded-2xl border shadow-sm lg:col-span-2 ${
            darkMode
              ? "bg-[#16201c] border-[#2c3d36]"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-base sm:text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? "text-white" : "text-emerald-950"}`}
          >
            <Icons.CalendarDays className="w-5 h-5 text-[#008080] dark:text-[#9ece6a]" />
            আপনার বাজারের তালিকা
          </h2>

          <div className="space-y-3">
            {notesList.length > 0 ? (
              notesList.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4 transition-all ${
                    item.isCompleted
                      ? "opacity-60 bg-stone-100/50 dark:bg-[#111a17]/40 border-transparent"
                      : darkMode
                        ? "bg-[#111a17] border-[#2c3d36]"
                        : "bg-stone-50 border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 w-full">
                    <button
                      onClick={() => toggleComplete(item.id)}
                      className={`mt-1 flex-shrink-0 transition-colors ${
                        item.isCompleted
                          ? "text-green-500"
                          : "text-gray-400 hover:text-emerald-600"
                      }`}
                    >
                      {item.isCompleted ? (
                        <Icons.CheckSquare className="w-5 h-5" />
                      ) : (
                        <Icons.Square className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <h3
                        className={`font-bold text-sm sm:text-base transition-all ${
                          item.isCompleted
                            ? "line-through text-gray-500"
                            : darkMode
                              ? "text-white"
                              : "text-emerald-950"
                        }`}
                      >
                        {item.cropName}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mt-1">
                        <span>
                          পরিমাণ:{" "}
                          <strong
                            className={
                              item.isCompleted
                                ? ""
                                : "text-gray-300 dark:text-gray-200"
                            }
                          >
                            {item.quantity}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          বাজেট:{" "}
                          <strong
                            className={
                              item.isCompleted
                                ? ""
                                : "text-gray-300 dark:text-gray-200"
                            }
                          >
                            {item.estimatedBudget}
                          </strong>
                        </span>
                      </div>

                      {item.notes && (
                        <p
                          className={`text-xs mt-2 p-2 rounded-lg italic break-words ${
                            darkMode
                              ? "bg-[#16201c] text-gray-400"
                              : "bg-white text-stone-600 border border-gray-100"
                          }`}
                        >
                          💡 {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteNote(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1 self-end sm:self-start shrink-0"
                  >
                    <Icons.Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400 text-sm font-semibold">
                আপনার বাজার নোটে কোনো আইটেম যোগ করা নেই!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotePage;