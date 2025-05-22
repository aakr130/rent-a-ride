"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import "./topbar.css";
import { useEffect, useState } from "react";

export default function Topbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setIsLoggedIn(data.authenticated);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        setIsLoggedIn(false);
        localStorage.removeItem("user");
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 z-50 w-full px-8 py-4 border-b shadow-[0_4px_30px_rgba(0,0,0,0.05)]
      bg-white/80 backdrop-blur-md border-white/30"
    >
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <Link href="/" className="flex items-center space-x-3">
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

        <div className="flex items-center space-x-6 text-sm font-medium">
          {!isLoggedIn ? (
            <>
              {["aboutus", "contactus", "login"].map((path, i) => (
                <Link
                  key={i}
                  href={`/${path}`}
                  className="relative inline-block text-black transition duration-300 hover:text-red-400 group animated-underline"
                >
                  {path.charAt(0).toUpperCase() +
                    path.slice(1).replace("us", " Us")}
                </Link>
              ))}
              <Link
                href="/signup"
                className="px-5 py-2 font-semibold text-black transition duration-300 rounded-full shadow-lg bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-600 hover:text-white"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link href="/notifications" className="relative">
                <Bell size={22} />
                <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
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
                onClick={logout}
                className="px-4 py-1.5 text-sm font-medium text-white transition bg-red-500 rounded-full hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
