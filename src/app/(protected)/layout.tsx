"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { Navbar } from "@/components/Navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 bg-muted/10">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}

