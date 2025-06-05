"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Brand } from "../../../../types";
import BrandButton from "../../../../components/BrandButton";
import VehicleCard from "../../../../components/VehicleCard";
import BottomNavigation from "../../../../components/BottomNavigation";
import Searchbox from "../../../../components/Searchbox";
import Spinner from "@/app/icons/spinner";

type Scooter = {
  id: number;
  name: string;
  images: string[];
  price: number;
  rating: number;
  seats: number;
  location: string;
  description: string;
  type: string;
  brand: string;
  tags: string[];
};

export default function ScooterDashboard() {
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const selectedBrand = searchParams?.get("brand");

  useEffect(() => {
    const fetchScooters = async () => {
      try {
        const res = await fetch("/api/vehicles/all");
        const data = await res.json();

        if (Array.isArray(data)) {
          const scooterList = data.filter((v) => v.type === "scooter");
          setScooters(scooterList);

          const brandMap = new Map<string, Brand>();
          scooterList.forEach((scooter) => {
            const raw = scooter.brand?.trim();
            if (!raw) return;
            const key = raw.toLowerCase();
            if (!brandMap.has(key)) {
              brandMap.set(key, {
                id: brandMap.size + 1,
                name: raw,
                logo: scooter.images?.[0] || "/images/placeholder.jpg",
              });
            }
          });

          setBrands(Array.from(brandMap.values()));
        }
      } catch (error) {
        console.error("Error loading scooters", error);
      } finally {
        setTimeout(() => setLoading(false), 200);
      }
    };
    fetchScooters();
  }, []);

  const filteredScooters = scooters.filter((scooter) => {
    if (!selectedBrand || selectedBrand.toLowerCase() === "all") return true;
    return scooter.brand?.toLowerCase() === selectedBrand.toLowerCase();
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8 text-gray-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6 pb-20 text-gray-900 pt-28 bg-gradient-to-b from-white via-slate-100 to-white">
      <div className="mb-8">
        <Searchbox />
      </div>

      {/* Brands */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Scooter Brands
        </h2>
        <div className="flex gap-5 pb-2 overflow-x-auto no-scrollbar">
          {brands.map((brand) => (
            <BrandButton key={brand.id} brand={brand} type="scooter" />
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
          {filteredScooters.filter((s) => s.tags?.includes("top")).length >
          0 ? (
            filteredScooters
              .filter((s) => s.tags?.includes("top"))
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
          {filteredScooters.filter((s) => s.tags?.includes("just-added"))
            .length > 0 ? (
            filteredScooters
              .filter((s) => s.tags?.includes("just-added"))
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
          {filteredScooters.filter((s) => s.tags?.includes("electric")).length >
          0 ? (
            filteredScooters
              .filter((s) => s.tags?.includes("electric"))
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
