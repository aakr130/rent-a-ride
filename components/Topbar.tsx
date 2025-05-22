"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import "./topbar.css";

export default function Topbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(data.authenticated))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const isProtectedRoute =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/profile");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b shadow bg-white/80 backdrop-blur-md border-white/30">
      <div className="flex items-center justify-between max-w-screen-xl px-4 py-3 mx-auto md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white/90">
            <Image
              src="/images/logo.png"
              alt="Rent-a-ride Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="text-lg font-bold tracking-wide text-gray-800">
            Rent-a-ride
          </span>
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-800 md:hidden"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Navigation */}
        <div
          className={`${
            mobileOpen ? "block" : "hidden"
          } absolute top-16 left-0 w-full px-4 pb-4 bg-white shadow-md md:shadow-none md:static md:bg-transparent md:flex md:items-center md:justify-end md:space-x-6 md:pb-0 md:px-0`}
        >
          {isLoggedIn && isProtectedRoute ? (
            <>
              <Link
                href="/notifications"
                className="relative block py-2 md:py-0"
              >
                <Bell size={22} />
                <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                  2
                </span>
              </Link>
              <Link href="/profile">
                <Image
                  src="https://github.com/R3yz0n.png"
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 mt-2 text-white bg-red-500 rounded-full md:mt-0 hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {["aboutus", "contactus", "login"].map((path, i) => (
                <Link
                  key={i}
                  href={`/${path}`}
                  className="block py-2 text-black transition md:inline-block hover:text-red-500"
                >
                  {path.charAt(0).toUpperCase() +
                    path.slice(1).replace("us", " Us")}
                </Link>
              ))}
              <Link
                href="/signup"
                className="block px-4 py-2 mt-2 font-semibold text-center text-white transition rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:to-yellow-700 md:mt-0 md:inline-block"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
