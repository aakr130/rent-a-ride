"use client";

import Image from "next/image";
import Link from "next/link";

export default function DashboardMain() {
  return (
    <main className="flex flex-col items-center min-h-screen px-6 py-10 text-gray-900 pt-28 bg-gradient-to-b from-white via-slate-100 to-white">
      <div className="w-full max-w-6xl mb-10 text-center">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight">
          <span className="text-gray-800">Choose your ride.</span>{" "}
          <span className="text-yellow-500">Own the moment.</span>
        </h1>
        <p className="text-lg text-gray-500">
          Whether you&apos;re craving <span className="font-medium">power</span>
          , <span className="font-medium">agility</span>, or{" "}
          <span className="font-medium">simplicity</span> — your ride is just
          one click away.
        </p>
      </div>

      <div className="grid w-full max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
        <Link href="/dashboard/cars" className="group">
          <div className="p-6 text-center transition-all duration-300 transform bg-white border border-gray-200 shadow-xl rounded-2xl hover:shadow-2xl hover:border-yellow-400 hover:scale-105">
            <div className="relative w-40 h-40 mx-auto mb-4 overflow-hidden shadow-md rounded-xl">
              <Image
                src="/images/car1.jpg"
                alt="Car"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-yellow-500">
              Cars
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Luxury. Comfort. Speed.
            </p>
          </div>
        </Link>

        <Link href="/dashboard/bikes" className="group">
          <div className="p-6 text-center transition-all duration-300 transform bg-white border border-gray-200 shadow-xl rounded-2xl hover:shadow-2xl hover:border-indigo-500 hover:scale-105">
            <div className="relative w-40 h-40 mx-auto mb-4 overflow-hidden shadow-md rounded-xl">
              <Image
                src="/images/bike1.jpg"
                alt="Bike"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-indigo-500">
              Bikes
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Agile. Bold. Built to thrill.
            </p>
          </div>
        </Link>

        <Link href="/dashboard/scooters" className="group">
          <div className="p-6 text-center transition-all duration-300 transform bg-white border border-gray-200 shadow-xl rounded-2xl hover:shadow-2xl hover:border-pink-400 hover:scale-105">
            <div className="relative w-40 h-40 mx-auto mb-4 overflow-hidden shadow-md rounded-xl">
              <Image
                src="/images/scooty1.jpg"
                alt="Scooter"
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-pink-500">
              Scooters
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Smart. Simple. City-ready.
            </p>
          </div>
        </Link>
      </div>
    </main>
  );
}
