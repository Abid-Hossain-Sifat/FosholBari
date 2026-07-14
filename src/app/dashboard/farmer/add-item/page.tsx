"use client";

import React, { useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  PlusCircle,
  Image as ImageIcon,
  Tag,
  Layers,
  DollarSign,
  Package,
  FileText,
  Loader2,
  CheckCircle2,
  Sprout,
  Plus,
  X,
  Upload,
  AlertCircle,
} from "lucide-react";
import { addProduct, uploadToImageBB } from "@/lib/data";

const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

const EMPTY_FORM = {
  name: "",
  tag: "",
  category: "শাক-সবজি",
  unit: "প্রতি কেজি",
  price: "",
  originalPrice: "",
  image: "",
  description: "",
};

const AddProductPage = () => {
  const { theme } = useTheme();
  const mounted = useMounted();
  const darkMode = mounted && theme === "dark";

  const [productData, setProductData] = useState(EMPTY_FORM);
  const [bulletPoints, setBulletPoints] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBulletChange = (index: number, value: string) => {
    setBulletPoints((prev) => prev.map((b, i) => (i === index ? value : b)));
  };

  const addBulletPoint = () => setBulletPoints((prev) => [...prev, ""]);

  const removeBulletPoint = (index: number) =>
    setBulletPoints((prev) => prev.filter((_, i) => i !== index));

  const handleImageFile = (file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("অনুগ্রহ করে একটি সঠিক ছবি ফাইল নির্বাচন করুন।");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("ছবির সাইজ ৫MB এর কম হতে হবে।");
      return;
    }
    setImageError("");
    const reader = new FileReader();
    reader.onload = () =>
      setProductData((prev) => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleImageFile(e.target.files?.[0]);

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleImageFile(e.dataTransfer.files?.[0]);
  };

  const removeImage = () => {
    setProductData((prev) => ({ ...prev, image: "" }));
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // 1. Upload image to ImageBB if it's base64
      let imageUrl = productData.image;
      if (imageUrl && imageUrl.startsWith("data:")) {
        imageUrl = await uploadToImageBB(imageUrl);
      }

      // 2. POST product to server
      const payload = {
        ...productData,
        image: imageUrl,
        price: Number(productData.price),
        originalPrice: productData.originalPrice
          ? Number(productData.originalPrice)
          : null,
        bulletPoints: bulletPoints.filter((b) => b.trim() !== ""),
      };

      const result = await addProduct(payload);

      if (result?.message && !result?._id) {
        setError(result.message || "কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন।");
        return;
      }

      // 3. Reset form
      setIsSuccess(true);
      setProductData(EMPTY_FORM);
      setBulletPoints([""]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "পণ্য যোগ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const darkInput =
    "bg-[#1B2420] border-[#26332d] focus:border-[#8cc655] focus:ring-[#8cc655] placeholder-gray-600";
  const lightInput =
    "bg-gray-50 border-gray-200 focus:border-[#316312] focus:ring-[#316312] placeholder-gray-400";
  const baseInput =
    "w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-1 transition-all";
  const inputCls = `${baseInput} ${darkMode ? darkInput : lightInput}`;
  const labelCls = "text-xs font-bold text-gray-400 flex items-center gap-1 mb-1.5";
  const dropzoneCls = darkMode
    ? "border-[#26332d] hover:border-[#8cc655] bg-[#1B2420]"
    : "border-gray-200 hover:border-[#316312] bg-gray-50";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <Sprout className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
          নতুন পণ্য যোগ করুন
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          আপনার খামারের তাজা ফসল সরাসরি ক্রেতাদের কাছে বিক্রির জন্য লিস্টিং
          তৈরি করুন।
        </p>
      </div>

      {/* Success Alert */}
      {isSuccess && (
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-[#9ece6a]">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-bold">
            পণ্যটি সফলভাবে বাজারে যোগ করা হয়েছে এবং এটি এখন লাইভ!
          </p>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-bold">{error}</p>
        </div>
      )}

      {/* Form Card */}
      <div
        className={
          darkMode
            ? "p-5 sm:p-6 rounded-2xl border bg-[#16201c] border-[#26332d]"
            : "p-5 sm:p-6 rounded-2xl border bg-white border-gray-200"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* পণ্যের নাম + ট্যাগ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                <Tag size={12} /> পণ্যের নাম
              </label>
              <input
                type="text"
                name="name"
                value={productData.name}
                onChange={handleChange}
                required
                placeholder="উদা: দেশি টমেটো (ফ্রেশ)"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>
                <Tag size={12} /> ট্যাগ
              </label>
              <input
                type="text"
                name="tag"
                value={productData.tag}
                onChange={handleChange}
                placeholder="উদা: টাটকা, অর্গানিক, সিজনাল..."
                className={inputCls}
              />
            </div>
          </div>

          {/* ক্যাটাগরি + একক */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                <Layers size={12} /> ক্যাটাগরি
              </label>
              <select
                name="category"
                value={productData.category}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="শাক-সবজি">শাক-সবজি</option>
                <option value="ধান ও চাল">ধান ও চাল</option>
                <option value="মরসুমী ফল">মরসুমী ফল</option>
                <option value="ডাল ও শস্য">ডাল ও শস্য</option>
                <option value="খাঁটি মশলা">খাঁটি মশলা</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>
                <Package size={12} /> পরিমাপের একক
              </label>
              <select
                name="unit"
                value={productData.unit}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="প্রতি কেজি">প্রতি কেজি</option>
                <option value="প্রতি মন">প্রতি মন</option>
                <option value="প্রতি গ্রাম">প্রতি গ্রাম</option>
                <option value="প্রতি পিস">প্রতি পিস</option>
                <option value="প্রতি লিটার">প্রতি লিটার</option>
                <option value="প্রতি আঁটি">প্রতি আঁটি</option>
              </select>
            </div>
          </div>

          {/* মূল্য + আসল মূল্য */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                <DollarSign size={12} /> বিক্রয় মূল্য (টাকা)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                  ৳
                </span>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleChange}
                  required
                  placeholder="0"
                  min="1"
                  className={`${inputCls} pl-8`}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>
                <DollarSign size={12} /> আসল মূল্য / MRP (টাকা)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                  ৳
                </span>
                <input
                  type="number"
                  name="originalPrice"
                  value={productData.originalPrice}
                  onChange={handleChange}
                  placeholder="0"
                  min="1"
                  className={`${inputCls} pl-8`}
                />
              </div>
            </div>
          </div>

          {/* ছবি আপলোড */}
          <div>
            <label className={labelCls}>
              <ImageIcon size={12} /> পণ্যের ছবি
            </label>

            {productData.image ? (
              <div className="relative w-full h-36 sm:h-40 md:h-44 lg:h-48">
                <img
                  src={productData.image}
                  alt="পণ্যের ছবি প্রিভিউ"
                  className="w-full h-full object-cover rounded-xl border border-gray-200 dark:border-[#26332d]"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleImageDrop}
                className={`flex flex-col items-center justify-center gap-1.5 sm:gap-2 w-full h-36 sm:h-40 md:h-44 lg:h-48 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${dropzoneCls}`}
              >
                <Upload size={18} className="text-gray-400 sm:w-5 sm:h-5" />
                <p className="text-xs font-bold text-gray-400 text-center px-4">
                  ছবি আপলোড করতে ক্লিক করুন
                  <br />
                  অথবা এখানে টেনে আনুন
                </p>
                <p className="text-[10px] text-gray-400">PNG, JPG (সর্বোচ্চ ৫MB)</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageInputChange}
              className="hidden"
            />

            {imageError && (
              <p className="text-xs font-bold text-red-500 mt-1.5">{imageError}</p>
            )}
          </div>

          {/* বিবরণ */}
          <div>
            <label className={labelCls}>
              <FileText size={12} /> পণ্যের বিবরণ
            </label>
            <textarea
              name="description"
              rows={3}
              value={productData.description}
              onChange={handleChange}
              required
              placeholder="পণ্যের গুণগত মান, উৎপাদন প্রক্রিয়া বা বিশেষত্ব লিখুন..."
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Bullet Points */}
          <div>
            <label className={labelCls}>
              <FileText size={12} /> বৈশিষ্ট্যসমূহ (Bullet Points)
            </label>
            <div className="space-y-2">
              {bulletPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 shrink-0">
                    {index + 1}.
                  </span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handleBulletChange(index, e.target.value)}
                    placeholder="উদা: সরাসরি বাগান থেকে সংগৃহীত।"
                    className={inputCls}
                  />
                  {bulletPoints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBulletPoint(index)}
                      className="shrink-0 p-1.5 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  addBulletPoint();
                }}
                className={
                  darkMode
                    ? "inline-flex items-center gap-1.5 text-xs font-bold text-[#9ece6a] hover:text-[#8cc655] hover:underline cursor-pointer transition-colors mt-1"
                    : "inline-flex items-center gap-1.5 text-xs font-bold text-[#316312] hover:text-emerald-800 hover:underline cursor-pointer transition-colors mt-1"
                }
              >
                <Plus size={13} />
                আরো বৈশিষ্ট্য যোগ করুন
              </Link>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={
                darkMode
                  ? `flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all select-none cursor-pointer hover:shadow-lg active:scale-95 bg-[#8cc655] hover:bg-[#9ece6a] text-[#111a17] ${isSubmitting ? "opacity-75 cursor-wait" : ""}`
                  : `flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all select-none cursor-pointer hover:shadow-lg active:scale-95 bg-[#316312] hover:bg-emerald-800 text-white ${isSubmitting ? "opacity-75 cursor-wait" : ""}`
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  আপলোড হচ্ছে...
                </>
              ) : (
                <>
                  <PlusCircle size={16} />
                  পণ্য যোগ করুন
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;