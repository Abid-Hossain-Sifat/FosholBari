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
      router.push("/auth");
    } else {
      const role = session.user.role;
      if (role === "Buyer") {
        router.push("/dashboard/buyer");
      } else if (role === "Farmer") {
        router.push("/dashboard/farmer");
      } else if (role === "Admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/unauthorized");
      }
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#faf9f5] dark:bg-[#111a17]">
      <HarvestLoader variant="fallback" />
    </div>
  );
}
