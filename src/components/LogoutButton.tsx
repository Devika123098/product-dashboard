"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function LogoutButton() {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  return (
    <Button
      variant="destructive"
      onClick={() => {
        logout();
        router.push("/login");
      }}
    >
      Logout
    </Button>
  );
}
