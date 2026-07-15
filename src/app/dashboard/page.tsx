"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { HarvestLoader } from "@/Components/loading";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/auth");
      return;
    }

    const role = session.user.role;
    if (role === "Buyer") {
      router.replace("/dashboard/buyer");
    } else if (role === "Farmer") {
      router.replace("/dashboard/farmer");
    } else if (role === "Admin") {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/unauthorized");
    }
  }, [session, isPending, router]);

  if (!isPending) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#faf9f5] dark:bg-[#111a17]">
      <HarvestLoader variant="fallback" />
    </div>
  );
}
