import { AuthGuard } from "@/components/AuthGuard";
import { AdminGuard } from "@/components/AdminGuard";
import { Navbar } from "@/components/Navbar";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AuthGuard>
      <AdminGuard>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 bg-muted/10">
            {children}
          </main>
        </div>
      </AdminGuard>
    </AuthGuard>
  );
}
