"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { jwtHelper } from "@/lib/jwt-helper";

export default function AuthSync() {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (session?.user) {
      const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:11111";
      const existing = jwtHelper.getToken();
      if (!existing) {
        jwtHelper.fetchToken(baseURL);
      }
    } else {
      jwtHelper.clearToken();
    }
  }, [session, isPending]);

  return null;
}
