"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Brand, Car } from "../../../../types";
import BrandButton from "../../../../components/BrandButton";
import VehicleCard from "../../../../components/VehicleCard";
import BottomNavigation from "../../../../components/BottomNavigation";
import Searchbox from "../../../../components/Searchbox";

export default function ScooterDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const brands: Brand[] = [
    { id: 1, name: "Honda", logo: "/images/dio.jpg" },
    { id: 2, name: "Vespa", logo: "/images/vespa.jpg" },
    { id: 3, name: "TVS", logo: "/images/tvs.jpg" },
  ];

  const allScooters: Car[] = [
    {
      id: 1,
      name: "Honda Dio",
      image: "/images/dio.png",
      rating: 4.9,
      location: "Butwal, Nepal",
      price: 900,
    },
    {
      id: 2,
      name: "Vespa Elegante",
      image: "/images/vespa.jpg",
      rating: 4.8,
      location: "Pokhara, Nepal",
      price: 1200,
    },
    {
      id: 3,
      name: "TVS Jupiter",
      image: "/images/tvs.jpg",
      rating: 4.7,
      location: "Kathmandu, Nepal",
      price: 1000,
    },
  ];

  return (
    <main className="min-h-screen px-6 pb-20 text-gray-900 pt-28 bg-gradient-to-b from-white via-slate-100 to-white">
      <div className="mb-8">
        <Searchbox />
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Scooter Brands
        </h2>
        <div className="flex gap-5 pb-2 overflow-x-auto no-scrollbar">
          {brands.map((brand) => (
            <BrandButton key={brand.id} brand={brand} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">🛵 Top Rated Scooters</h2>
          <Link
            href="/scooters"
            className="text-sm text-blue-500 hover:underline"
          >
            View All
          </Link>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          City rides that deliver smooth and smart performance
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {allScooters
            .filter((scooter) => scooter.rating >= 4.7)
            .map((scooter) => (
              <VehicleCard
                key={scooter.id + "-top"}
                car={scooter}
                type="scooter"
              />
            ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">🆕 Just Added</h2>
          <Link
            href="/scooters?sort=new"
            className="text-sm text-blue-500 hover:underline"
          >
            View All
          </Link>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          Discover our newest smart commuters
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {allScooters.slice(0, 2).map((scooter) => (
            <VehicleCard
              key={scooter.id + "-new"}
              car={scooter}
              type="scooter"
            />
          ))}
        </div>
      </section>

      <div className="block md:hidden">
        <BottomNavigation activeTab="home" />
      </div>
    </main>
  );
}
