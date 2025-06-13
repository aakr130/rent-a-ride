import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Topbar from "../../components/Topbar";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "./providers/QueryProvider";
import { usePathname } from "next/navigation";
import { WishlistProvider } from "@/context/WishlistContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <WishlistProvider>
            {!isAdminRoute && <Topbar />}
            {children}
            <Toaster position="top-right" />
          </WishlistProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
