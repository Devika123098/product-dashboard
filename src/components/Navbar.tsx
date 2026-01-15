"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, LogOut, User, Plus } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 w-full">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/products" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span>StoreDash</span>
          </Link>
          
          <div className="flex items-center gap-1">
            <Link href="/products">
              <Button variant="ghost" size="sm" className="gap-2">
                <LayoutDashboard className="h-4 w-4" /> <span className="hidden sm:inline">Products</span>
              </Button>
            </Link>
            {user?.role?.toLowerCase() === "admin" && (
              <Link href="/admin/add-product">
                <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary hover:bg-primary/10">
                   <Plus className="h-4 w-4" /> <span>Add Product</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{user?.username}</span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary font-bold">
              {user?.role}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
