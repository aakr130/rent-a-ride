"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Brand, Car } from "../../../../types";
import BrandButton from "../../../../components/BrandButton";
import CarCard from "../../../../components/VehicleCard";
import BottomNavigation from "../../../../components/BottomNavigation";
import VehicleCard from "../../../../components/VehicleCard";
import Searchbox from "../../../../components/Searchbox";

export default function BikeDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const brands: Brand[] = [
    { id: 1, name: "Royal Enfield", logo: "/images/royal.jpg" },
    { id: 2, name: "Ducati", logo: "/images/ducati.jpg" },
    { id: 3, name: "Kawasaki", logo: "/images/kawasaki.jpg" },
    { id: 4, name: "Yamaha", logo: "/images/yamaha.jpg" },
  ];

  const allBikes: Car[] = [
    {
      id: 1,
      name: "Royal Enfield Hunter",
      image: "/images/dash-royal.jpg",
      rating: 4.9,
      location: "Bhalwari, Nepal",
      seats: 2,
      price: 1500,
    },
    {
      id: 2,
      name: "Ducati Monster",
      image: "/images/dash-ducati.jpg",
      rating: 5.0,
      location: "Manigram, Nepal",
      seats: 2,
      price: 2000,
    },
    {
      id: 3,
      name: "Kawasaki Ninja",
      image: "/images/kawasaki.jpg",
      rating: 4.8,
      location: "Naymill, Nepal",
      seats: 2,
      price: 2500,
    },
  ];

  return (
    <main className="min-h-screen px-6 pb-20 text-gray-900 pt-28 bg-gradient-to-b from-white via-slate-100 to-white">
      <div className="mb-8">
        <Searchbox />
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Bike Brands
        </h2>
        <div className="flex gap-5 pb-2 overflow-x-auto no-scrollbar">
          {brands.map((brand) => (
            <BrandButton key={brand.id} brand={brand} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">🏍️ Top Rated Bikes</h2>
          <Link href="/bikes" className="text-sm text-blue-500 hover:underline">
            View All
          </Link>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          High-performance machines for enthusiasts
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {allBikes
            .filter((bike) => bike.rating >= 4.8)
            .map((bike) => (
              <VehicleCard key={bike.id + "-top"} vehicle={bike} type="bike" />
            ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">🆕 Just Added</h2>
          <Link
            href="/bikes?sort=new"
            className="text-sm text-blue-500 hover:underline"
          >
            View All
          </Link>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          Explore the newest two-wheelers
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {allBikes.slice(0, 2).map((bike) => (
            <VehicleCard key={bike.id + "-new"} vehicle={bike} type="bike" />
          ))}
        </div>
      </section>

      <div className="block md:hidden">
        <BottomNavigation activeTab="home" />
      </div>
    </main>
  );
}
