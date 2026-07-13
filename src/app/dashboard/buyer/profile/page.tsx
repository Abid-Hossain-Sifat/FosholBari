"use client";

import React, { useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import * as Icons from "lucide-react";
import { authClient } from "@/lib/auth-client";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const BuyerProfile = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  const { data: session } = authClient.useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      alert("আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
    }, 1200);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword.length < 6) {
      setPasswordError("নতুন পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("নতুন পাসওয়ার্ড ও নিশ্চিতকরণ পাসওয়ার্ড মিলছে না");
      return;
    }

    setIsPasswordSaving(true);

    setTimeout(() => {
      setIsPasswordSaving(false);
      closePasswordModal();
      alert("আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!");
    }, 1200);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto px-3 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${darkMode ? "text-white" : "text-emerald-950"}`}
          >
            আমার প্রোফাইল
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            আপনার ব্যক্তিগত তথ্য, পাসওয়ার্ড ও ঠিকানা পরিচালনা করুন
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all shadow-sm ${
              darkMode
                ? "bg-[#16201c] border-[#2c3d36] text-[#9ece6a] hover:bg-[#202f2a]"
                : "bg-white border-gray-200 text-[#008080] hover:bg-stone-50"
            }`}
          >
            <Icons.UserCheck className="w-4 h-4" /> তথ্য এডিট করুন
          </button>
        )}
      </div>

      <form
        onSubmit={handleUpdateProfile}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start"
      >
        <div
          className={`p-5 sm:p-6 rounded-2xl border shadow-sm text-center flex flex-col items-center justify-center lg:col-span-1 ${
            darkMode
              ? "bg-[#16201c] border-[#2c3d36]"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="relative group">
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex items-center justify-center font-black text-3xl sm:text-4xl shadow-inner border-2 ${
                darkMode
                  ? "bg-[#8cc655]/10 text-[#8cc655] border-[#9ece6a]/30"
                  : "bg-[#008080]/10 text-[#008080] border-[#008080]/20"
              }`}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : name ? (
                name[0].toUpperCase()
              ) : (
                "U"
              )}
            </div>

            {isEditing && (
              <label
                className={`absolute bottom-0 right-0 p-2 rounded-full border shadow-md cursor-pointer transition-all ${
                  darkMode
                    ? "bg-[#111a17] border-[#2c3d36] text-gray-300 hover:text-white"
                    : "bg-stone-50 border-gray-200 text-stone-600 hover:bg-stone-100"
                }`}
              >
                <Icons.Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div className="mt-4 w-full">
            <h2
              className={`text-base sm:text-lg font-bold truncate ${darkMode ? "text-white" : "text-emerald-950"}`}
            >
              {name || "আপনার নাম লিখুন"}
            </h2>
            <span className="text-[11px] text-gray-400 block mt-1">
              অ্যাকাউন্ট টাইপ: ক্রেতা
            </span>
          </div>

          <div
            className={`w-full border-t my-5 ${darkMode ? "border-[#2c3d36]" : "border-gray-100"}`}
          ></div>

          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
              darkMode
                ? "bg-[#111a17] border-[#2c3d36] text-gray-200 hover:bg-[#202f2a]"
                : "bg-stone-50 border-gray-200 text-stone-700 hover:bg-stone-100"
            }`}
          >
            <Icons.Lock className="w-4 h-4" /> পাসওয়ার্ড পরিবর্তন করুন
          </button>
        </div>

        <div
          className={`p-4 sm:p-5 md:p-6 rounded-2xl border shadow-sm lg:col-span-2 ${
            darkMode
              ? "bg-[#16201c] border-[#2c3d36]"
              : "bg-white border-gray-200"
          }`}
        >
          <h3
            className={`text-base sm:text-lg font-bold mb-5 flex items-center gap-2 ${darkMode ? "text-white" : "text-emerald-950"}`}
          >
            <Icons.UserCog className="w-5 h-5 text-[#008080] dark:text-[#9ece6a]" />
            বিস্তারিত প্রোফাইল তথ্য
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">
                  পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  disabled={!isEditing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার নাম লিখুন"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    !isEditing
                      ? "bg-[#111a17]/50 border-transparent cursor-not-allowed text-gray-500"
                      : darkMode
                        ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                        : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                  }`}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">
                  ইমেইল ঠিকানা *
                </label>
                <input
                  type="email"
                  required
                  disabled={!isEditing}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার ইমেইল দিন"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                    !isEditing
                      ? "bg-[#111a17]/50 border-transparent cursor-not-allowed text-gray-500"
                      : darkMode
                        ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                        : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                মোবাইল নম্বর *
              </label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="আপনার সচল মোবাইল নম্বর দিন"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  !isEditing
                    ? "bg-[#111a17]/50 border-transparent cursor-not-allowed text-gray-500"
                    : darkMode
                      ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                      : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                }`}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 block mb-1">
                ডেলিভারি লোকেশন / ঠিকানা *
              </label>
              <textarea
                rows={3}
                required
                disabled={!isEditing}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="যে ঠিকানায় আপনার ফসল ডেলিভারি নিতে চান তা বিস্তারিত লিখুন..."
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none ${
                  !isEditing
                    ? "bg-[#111a17]/50 border-transparent cursor-not-allowed text-gray-500"
                    : darkMode
                      ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                      : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                }`}
              />
            </div>

            {isEditing && (
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                    darkMode
                      ? "border-[#2c3d36] text-gray-400 hover:bg-[#111a17]"
                      : "border-gray-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    isSaving ? "opacity-50 cursor-wait" : ""
                  } ${
                    darkMode
                      ? "bg-[#9ece6a] text-black hover:bg-[#8cc655]"
                      : "bg-[#008080] text-white hover:bg-emerald-700"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Icons.Loader2 className="w-4 h-4 animate-spin" />{" "}
                      সেভ হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Icons.Save className="w-4 h-4" /> তথ্য সংরক্ষণ করুন
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </form>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closePasswordModal}
          />

          <div
            className={`relative w-full max-w-md rounded-2xl border shadow-xl p-5 sm:p-6 ${
              darkMode
                ? "bg-[#16201c] border-[#2c3d36]"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-5">
              <h3
                className={`text-base sm:text-lg font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-emerald-950"}`}
              >
                <Icons.KeyRound className="w-5 h-5 text-[#008080] dark:text-[#9ece6a]" />
                পাসওয়ার্ড পরিবর্তন করুন
              </h3>
              <button
                type="button"
                onClick={closePasswordModal}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">
                  পুরাতন পাসওয়ার্ড *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="বর্তমান পাসওয়ার্ডটি লিখুন"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      darkMode
                        ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                        : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                    }`}
                  />
                  <Icons.Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">
                  নতুন পাসওয়ার্ড *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="নতুন পাসওয়ার্ড দিন"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      darkMode
                        ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                        : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                    }`}
                  />
                  <Icons.KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 block mb-1">
                  নতুন পাসওয়ার্ড নিশ্চিত করুন *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="নতুন পাসওয়ার্ড আবার লিখুন"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                      darkMode
                        ? "bg-[#111a17] border-[#2c3d36] text-white focus:border-[#9ece6a]"
                        : "bg-stone-50 border-gray-200 focus:border-[#008080]"
                    }`}
                  />
                  <Icons.KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {passwordError && (
                <p className="text-xs font-semibold text-red-500">
                  {passwordError}
                </p>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                    darkMode
                      ? "border-[#2c3d36] text-gray-400 hover:bg-[#111a17]"
                      : "border-gray-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={isPasswordSaving}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    isPasswordSaving ? "opacity-50 cursor-wait" : ""
                  } ${
                    darkMode
                      ? "bg-[#9ece6a] text-black hover:bg-[#8cc655]"
                      : "bg-[#008080] text-white hover:bg-emerald-700"
                  }`}
                >
                  {isPasswordSaving ? (
                    <>
                      <Icons.Loader2 className="w-4 h-4 animate-spin" />{" "}
                      সেভ হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Icons.Save className="w-4 h-4" /> পাসওয়ার্ড সংরক্ষণ করুন
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerProfile;