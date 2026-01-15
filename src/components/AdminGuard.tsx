"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (user.role?.toLowerCase() !== "admin") {
      router.replace("/products");
    }
  }, [user, router]);

  if (!user || user.role?.toLowerCase() !== "admin") return null;

  return <>{children}</>;
}
