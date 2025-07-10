"use client";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative w-full h-screen bg-[#0D0D2B] text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D2B] via-[#1A1A40] to-[#0F2027] z-0" />

      <div className="absolute right-10 bottom-0 w-[440px] h-[880px] hidden lg:block z-10 animate-slow-spin">
        <Image
          src="/images/phone.png"
          alt="App Preview"
          layout="fill"
          className="object-contain"
          priority
        />
      </div>

      <div className="relative z-20 flex flex-col justify-between h-full px-8 py-6 mx-auto max-w-7xl">
        <section className="flex flex-col justify-center flex-1">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Make Your Ride <br />
            <span className="text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text">
              Fast & Easy
            </span>
          </h1>
          <p className="max-w-xl mb-8 text-lg font-light text-gray-300">
            Discover your next adventure with Rent-a-ride. We provide a seamless
            bike and car rental experience to get you where you need to
            go—quickly, comfortably, and hassle-free.
          </p>

          <Link
            href="/login"
            className="inline-block px-8 py-3 text-base font-semibold text-white transition-all duration-300 rounded-full shadow-lg w-fit bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 hover:scale-105 active:scale-95"
          >
            Login
          </Link>
        </section>
      </div>

      <style jsx>{`
        @keyframes pulse-fast {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.95);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-pulse-fast {
          animation: pulse-fast 2s ease-in-out infinite;
        }
      `}</style>

      <style jsx>{`
        @keyframes slow-spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes car-move {
          0% {
            left: -60px;
          }
          100% {
            left: 100%;
          }
        }

        .animate-slow-spin {
          animation: slow-spin 30s linear infinite;
        }

        .animate-car-move {
          animation: car-move 12s linear infinite;
        }
      `}</style>
    </main>
  );
}
