"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import * as Icons from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getProfile, updateProfile, uploadToImageBB } from "@/lib/data";
import { toast } from "react-toastify";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const FarmerProfilePage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  const { data: session } = authClient.useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Form states initialized empty, populated in useEffect
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    nid: "",
    farmName: "",
    farmLocation: "",
    bio: "",
  });

  const [paymentInfo, setPaymentInfo] = useState({
    bkash: "",
    nagad: "",
    bankName: "",
    accountName: "",
    accountNumber: "",
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileData = await getProfile();
        setPersonalInfo({
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          phone: session?.user?.phoneNumber || profileData.phone || "",
          nid: profileData.nid || "",
          farmName: profileData.farmName || "",
          farmLocation: profileData.farmLocation || "",
          bio: profileData.bio || "",
        });
        setPaymentInfo({
          bkash: profileData.bkash || "",
          nagad: profileData.nagad || "",
          bankName: profileData.bankName || "",
          accountName: profileData.accountName || "",
          accountNumber: profileData.accountNumber || "",
        });
        if (profileData.image) {
          setProfileImage(profileData.image);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
        setPersonalInfo((prev) => ({
          ...prev,
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          phone: session?.user?.phoneNumber || "",
        }));
      }
    };

    if (session?.user) {
      fetchProfileData();
    }
  }, [session]);

  const handlePersonalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = profileImage;
      if (imageFile) {
        const reader = new FileReader();
        const uploadPromise = new Promise<string>((resolve, reject) => {
          reader.onload = async () => {
            try {
              const url = await uploadToImageBB(reader.result as string);
              resolve(url);
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = () => reject(new Error("Image read error"));
          reader.readAsDataURL(imageFile);
        });
        imageUrl = await uploadPromise;
      }

      if (personalInfo.name && personalInfo.name !== session?.user?.name) {
        await authClient.updateUser({
          name: personalInfo.name,
        });
      }

      if (personalInfo.email && personalInfo.email !== session?.user?.email) {
        const res = await authClient.changeEmail({
          newEmail: personalInfo.email,
        });
        if (res?.error) {
          toast.error("ইমেইল পরিবর্তন করতে ব্যর্থ হয়েছে: " + res.error.message);
          setIsSaving(false);
          return;
        }
      }

      await updateProfile({
        phone: personalInfo.phone,
        nid: personalInfo.nid,
        farmName: personalInfo.farmName,
        farmLocation: personalInfo.farmLocation,
        bio: personalInfo.bio,
        bkash: paymentInfo.bkash,
        nagad: paymentInfo.nagad,
        bankName: paymentInfo.bankName,
        accountName: paymentInfo.accountName,
        accountNumber: paymentInfo.accountNumber,
        image: imageUrl,
      });

      toast.success("আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
      setIsEditing(false);
      setImageFile(null);
    } catch (err) {
      console.error(err);
      toast.error("প্রোফাইল আপডেট করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
    } finally {
      setIsSaving(false);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
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

    try {
      const res = await authClient.changePassword({
        currentPassword: oldPassword,
        newPassword: newPassword,
        revokeOtherSessions: true,
      });
      if (res?.error) {
        setPasswordError(res.error.message || "পাসওয়ার্ড পরিবর্তন করতে ব্যর্থ হয়েছে।");
      } else {
        closePasswordModal();
        toast.success("আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!");
      }
    } catch (err: any) {
      setPasswordError(err?.message || "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  // Disabled fields use a light, theme-aware gray instead of a hardcoded dark tint.
  const fieldClasses = (disabled: boolean) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
      disabled
        ? darkMode
          ? "bg-[#111a17]/60 border-transparent text-gray-400"
          : "bg-gray-100 border-transparent text-gray-500"
        : darkMode
          ? "bg-[#111a17] border-[#26332d] text-white focus:border-[#9ece6a]"
          : "bg-stone-50 border-gray-200 focus:border-[#316312]"
    }`;

  const modalFieldClasses = `w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
    darkMode
      ? "bg-[#111a17] border-[#26332d] text-white focus:border-[#9ece6a]"
      : "bg-stone-50 border-gray-200 focus:border-[#316312]"
  }`;

  // Same card treatment (padding, radius, border color) as the dashboard cards.
  const cardClasses = `p-5 rounded-2xl border ${
    darkMode ? "bg-[#16201c] border-[#26332d]" : "bg-white border-gray-200"
  }`;

  const labelClasses = "text-xs font-bold text-gray-400 block mb-1";

  const sectionHeadingClasses = `font-bold text-lg flex items-center gap-2 ${
    darkMode ? "text-white" : "text-emerald-950"
  }`;

  return (
    <div className="space-y-6">
      {/* Header — same title/subtitle treatment as the dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Icons.Settings2 className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
            প্রোফাইল সেটিংস
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            আপনার ব্যক্তিগত ও খামারের তথ্য পরিচালনা করুন।
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all shadow-sm ${
              darkMode
                ? "bg-[#16201c] border-[#26332d] text-[#9ece6a] hover:bg-[#202f2a]"
                : "bg-white border-gray-200 text-[#316312] hover:bg-stone-50"
            }`}
          >
            <Icons.UserCheck className="w-4 h-4" /> তথ্য এডিট করুন
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
      >
        {/* --- Avatar / Identity Card --- */}
        <div
          className={`${cardClasses} text-center flex flex-col items-center justify-center lg:col-span-1`}
        >
          <div className="relative group">
            <div
              className={`w-24 h-24 rounded-full overflow-hidden flex items-center justify-center font-black text-3xl shadow-inner border-2 ${
                darkMode
                  ? "bg-[#8cc655]/10 text-[#8cc655] border-[#9ece6a]/30"
                  : "bg-[#316312]/10 text-[#316312] border-[#316312]/20"
              }`}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                personalInfo.name.charAt(0)
              )}
            </div>

            {isEditing && (
              <label
                className={`absolute bottom-0 right-0 p-2 rounded-full border shadow-md cursor-pointer transition-all ${
                  darkMode
                    ? "bg-[#111a17] border-[#26332d] text-gray-300 hover:text-white"
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

          <div className="mt-4 w-full min-w-0">
            <h2
              className={`text-lg font-bold flex items-center justify-center gap-1.5 ${
                darkMode ? "text-white" : "text-emerald-950"
              }`}
            >
              <span className="truncate">{personalInfo.name}</span>
              <Icons.ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-[#9ece6a]" />
            </h2>
            <span className="text-xs text-gray-400 flex items-center justify-center gap-1 mt-1">
              <Icons.Briefcase className="w-3.5 h-3.5 shrink-0" /> ভেরিফাইড কৃষক
            </span>
            <span className="text-xs text-gray-400 flex items-center justify-center gap-1 mt-1 truncate">
              <Icons.MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{personalInfo.farmLocation}</span>
            </span>
          </div>

          <div
            className={`w-full border-t my-5 ${darkMode ? "border-[#26332d]" : "border-gray-100"}`}
          />

          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
              darkMode
                ? "bg-[#111a17] border-[#26332d] text-gray-200 hover:bg-[#202f2a]"
                : "bg-stone-50 border-gray-200 text-stone-700 hover:bg-stone-100"
            }`}
          >
            <Icons.Lock className="w-4 h-4" /> পাসওয়ার্ড পরিবর্তন করুন
          </button>
        </div>

        {/* --- Right Column: Personal + Payment merged in one card --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className={cardClasses}>
            {/* Personal & Farm Info */}
            <h3 className={`${sectionHeadingClasses} mb-4`}>
              <Icons.User className="w-5 h-5 text-[#316312] dark:text-[#9ece6a]" />
              ব্যক্তিগত ও খামারের তথ্য
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>পুরো নাম</label>
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={!isEditing}
                    value={personalInfo.name}
                    onChange={handlePersonalChange}
                    className={fieldClasses(!isEditing)}
                  />
                </div>

                <div>
                  <label className={labelClasses}>ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={!isEditing}
                    value={personalInfo.email}
                    onChange={handlePersonalChange}
                    className={fieldClasses(!isEditing)}
                  />
                </div>

                <div>
                  <label className={labelClasses}>মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    disabled={!isEditing}
                    value={personalInfo.phone}
                    onChange={handlePersonalChange}
                    className={fieldClasses(!isEditing)}
                  />
                </div>

                <div>
                  <label className={labelClasses}>
                    জাতীয় পরিচয়পত্র নম্বর (NID)
                  </label>
                  <input
                    type="text"
                    name="nid"
                    disabled={!isEditing}
                    value={personalInfo.nid}
                    onChange={handlePersonalChange}
                    className={fieldClasses(!isEditing)}
                  />
                </div>

                <div>
                  <label className={labelClasses}>খামারের নাম</label>
                  <input
                    type="text"
                    name="farmName"
                    required
                    disabled={!isEditing}
                    value={personalInfo.farmName}
                    onChange={handlePersonalChange}
                    className={fieldClasses(!isEditing)}
                  />
                </div>

                <div>
                  <label className={labelClasses}>খামারের ঠিকানা</label>
                  <input
                    type="text"
                    name="farmLocation"
                    required
                    disabled={!isEditing}
                    value={personalInfo.farmLocation}
                    onChange={handlePersonalChange}
                    className={fieldClasses(!isEditing)}
                  />
                </div>
              </div>

              <div>
                <label className={labelClasses}>
                  খামার নিয়ে সংক্ষিপ্ত বিবরণ (Bio)
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  disabled={!isEditing}
                  value={personalInfo.bio}
                  onChange={handlePersonalChange}
                  className={`${fieldClasses(!isEditing)} resize-none`}
                />
              </div>
            </div>

            <div
              className={`border-t my-5 ${darkMode ? "border-[#26332d]" : "border-gray-100"}`}
            />

            {/* Payment Info */}
            <h3 className={`${sectionHeadingClasses} mb-4`}>
              <Icons.CreditCard className="w-5 h-5 text-[#316312] dark:text-[#9ece6a]" />
              পেমেন্ট উইথড্রয়াল সেটিংস
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>
                  বিকাশ পার্সোনাল নম্বর (bKash)
                </label>
                <input
                  type="text"
                  name="bkash"
                  disabled={!isEditing}
                  value={paymentInfo.bkash}
                  onChange={handlePaymentChange}
                  className={fieldClasses(!isEditing)}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  নগদ পার্সোনাল নম্বর (Nagad)
                </label>
                <input
                  type="text"
                  name="nagad"
                  disabled={!isEditing}
                  value={paymentInfo.nagad}
                  onChange={handlePaymentChange}
                  className={fieldClasses(!isEditing)}
                />
              </div>

              <div>
                <label className={labelClasses}>ব্যাংক নাম</label>
                <input
                  type="text"
                  name="bankName"
                  disabled={!isEditing}
                  value={paymentInfo.bankName}
                  onChange={handlePaymentChange}
                  className={fieldClasses(!isEditing)}
                />
              </div>

              <div>
                <label className={labelClasses}>
                  অ্যাকাউন্ট হোল্ডারের নাম (ইংরেজি)
                </label>
                <input
                  type="text"
                  name="accountName"
                  disabled={!isEditing}
                  value={paymentInfo.accountName}
                  onChange={handlePaymentChange}
                  className={fieldClasses(!isEditing)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClasses}>অ্যাকাউন্ট নম্বর</label>
                <input
                  type="text"
                  name="accountNumber"
                  disabled={!isEditing}
                  value={paymentInfo.accountNumber}
                  onChange={handlePaymentChange}
                  className={fieldClasses(!isEditing)}
                />
              </div>
            </div>
          </div>

          {/* Save / Cancel — only visible while editing */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                  darkMode
                    ? "border-[#26332d] text-gray-400 hover:bg-[#111a17]"
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
                    : "bg-[#316312] text-white hover:bg-emerald-800"
                }`}
              >
                {isSaving ? (
                  <>
                    <Icons.Loader2 className="w-4 h-4 animate-spin" /> সেভ
                    হচ্ছে...
                  </>
                ) : (
                  <>
                    <Icons.Save className="w-4 h-4" /> প্রোফাইল সংরক্ষণ করুন
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </form>

      {/* --- Password Change Modal --- */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closePasswordModal}
          />

          <div
            className={`relative w-full max-w-md rounded-2xl border shadow-xl p-6 ${
              darkMode
                ? "bg-[#16201c] border-[#26332d]"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className={sectionHeadingClasses}>
                <Icons.KeyRound className="w-5 h-5 text-[#316312] dark:text-[#9ece6a]" />
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
                <label className={labelClasses}>পুরাতন পাসওয়ার্ড</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="বর্তমান পাসওয়ার্ডটি লিখুন"
                    className={modalFieldClasses}
                  />
                  <Icons.Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className={labelClasses}>নতুন পাসওয়ার্ড</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="নতুন পাসওয়ার্ড দিন"
                    className={modalFieldClasses}
                  />
                  <Icons.KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className={labelClasses}>
                  নতুন পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="নতুন পাসওয়ার্ড আবার লিখুন"
                    className={modalFieldClasses}
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
                      ? "border-[#26332d] text-gray-400 hover:bg-[#111a17]"
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
                      : "bg-[#316312] text-white hover:bg-emerald-800"
                  }`}
                >
                  {isPasswordSaving ? (
                    <>
                      <Icons.Loader2 className="w-4 h-4 animate-spin" /> সেভ
                      হচ্ছে...
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

export default FarmerProfilePage;