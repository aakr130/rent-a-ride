"use client";

import Image from "next/image";
import Link from "next/link";

export default function Topbar() {
  return (
    <nav className="flex items-center justify-between w-full px-6 py-2 shadow-sm backdrop-blur-sm bg-white/60">
      <Link href="/" className="flex items-center space-x-3">
        <div className="flex items-center justify-center bg-white rounded-full w-9 h-9">
          <Image
            src="/images/logo.png"
            alt="Rent-a-ride Logo"
            width={90}
            height={60}
          />
        </div>
      </Link>

      <div className="flex items-center space-x-6">
        <Link
          href="/aboutus"
          className="text-white transition hover:text-yellow-400"
        >
          About Us
        </Link>
        <Link
          href="/contactus"
          className="text-white transition hover:text-yellow-400"
        >
          Contact Us
        </Link>
        <Link
          href="/login"
          className="text-white transition hover:text-yellow-400"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="px-4 py-2 font-semibold text-black transition bg-white border border-black rounded-full hover:bg-yellow-400 hover:text-white"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
