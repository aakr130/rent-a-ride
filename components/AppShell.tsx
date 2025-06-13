"use client";

import { usePathname } from "next/navigation";
import Topbar from "./Topbar";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { WishlistProvider } from "@/context/WishlistContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <QueryProvider>
      <WishlistProvider>
        {!isAdminRoute && <Topbar />}
        {children}
        <Toaster position="top-right" />
      </WishlistProvider>
    </QueryProvider>
  );
}
