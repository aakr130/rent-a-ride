"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brand } from "../../../../types";
import BrandButton from "../../../../components/BrandButton";
import VehicleCard from "../../../../components/VehicleCard";
import BottomNavigation from "../../../../components/BottomNavigation";
import Searchbox from "../../../../components/Searchbox";

type Scooter = {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  seats: number;
  location: string;
  description: string;
  type: string;
  tags: string[];
};

export default function ScooterDashboard() {
  const [scooters, setScooters] = useState<Scooter[]>([]);

  useEffect(() => {
    const fetchScooters = async () => {
      const res = await fetch("/api/vehicles/all");
      const data = await res.json();
      if (Array.isArray(data)) {
        setScooters(data.filter((v) => v.type === "scooter"));
      }
    };
    fetchScooters();
  }, []);

  const brands: Brand[] = [
    { id: 1, name: "Honda", logo: "/images/dio.jpg" },
    { id: 2, name: "Vespa", logo: "/images/vespa.jpg" },
    { id: 3, name: "TVS", logo: "/images/tvs.jpg" },
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

      {/* 🛵 Top Rated Scooters */}
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
          {scooters.filter((s) => s.tags?.includes("top")).length > 0 ? (
            scooters
              .filter((scooter) => scooter.tags?.includes("top"))
              .map((scooter) => (
                <VehicleCard
                  key={scooter.id + "-top"}
                  vehicle={scooter}
                  type="scooter"
                />
              ))
          ) : (
            <p className="text-sm text-red-500 col-span-full">
              No top rated scooters available.
            </p>
          )}
        </div>
      </section>

      {/* 🆕 Just Added */}
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
          {scooters.filter((s) => s.tags?.includes("just-added")).length > 0 ? (
            scooters
              .filter((scooter) => scooter.tags?.includes("just-added"))
              .map((scooter) => (
                <VehicleCard
                  key={scooter.id + "-new"}
                  vehicle={scooter}
                  type="scooter"
                />
              ))
          ) : (
            <p className="text-sm text-red-500 col-span-full">
              No new scooters added recently.
            </p>
          )}
        </div>
      </section>

      {/* ⚡ Electric Scooters */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">⚡ Electric Picks</h2>
          <Link
            href="/scooters?filter=electric"
            className="text-sm text-blue-500 hover:underline"
          >
            View All
          </Link>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          Eco-friendly rides for your daily commute
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {scooters.filter((s) => s.tags?.includes("electric")).length > 0 ? (
            scooters
              .filter((scooter) => scooter.tags?.includes("electric"))
              .map((scooter) => (
                <VehicleCard
                  key={scooter.id + "-ev"}
                  vehicle={scooter}
                  type="scooter"
                />
              ))
          ) : (
            <p className="text-sm text-red-500 col-span-full">
              No electric scooters available.
            </p>
          )}
        </div>
      </section>

      <div className="block md:hidden">
        <BottomNavigation activeTab="home" />
      </div>
    </main>
  );
}
