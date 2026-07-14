"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { HarvestLoader } from "@/Components/loading";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push("/auth");
    } else if (session.user.role !== "Admin") {
      router.push("/unauthorized");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#faf9f5] dark:bg-[#111a17]">
        <HarvestLoader variant="fallback" />
      </div>
    );
  }

  if (!session?.user || session.user.role !== "Admin") {
    return null;
  }

  return <>{children}</>;
}
