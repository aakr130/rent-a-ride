"use client";

import { useEffect, useState, useTransition } from "react";
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
  color: string;
  fuel_type: string;
};

export default function ScooterDashboard() {
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const selectedBrand = searchParams?.get("brand");
  const [searchQuery, setSearchQuery] = useState("");
  const tagFilter = searchParams?.get("tag");

  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      fetchScooters();
    });
  }, [searchParams]);

  const fetchScooters = async () => {
    try {
      const params = new URLSearchParams(searchParams?.toString());
      params.set("type", "scooter");

      const res = await fetch(`/api/vehicles/all?${params.toString()}`);
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

  const filteredScooters = scooters.filter((scooter) => {
    const matchesBrand =
      !selectedBrand || selectedBrand.toLowerCase() === "all"
        ? true
        : scooter.brand?.toLowerCase() === selectedBrand.toLowerCase();

    const matchesSearch = scooter.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTag = tagFilter ? scooter.tags.includes(tagFilter) : true;

    return matchesBrand && matchesSearch && matchesTag;
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
        <Searchbox
          value={searchQuery}
          onChange={setSearchQuery}
          type="scooter"
        />
      </div>

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

      {filteredScooters.some((s) => s.tags?.includes("top")) && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">🛵 Top Rated Scooters</h2>
            {searchParams?.get("tag") !== "top" && (
              <Link
                href="/dashboard/scooters?tag=top"
                className="text-sm text-blue-500 hover:underline"
              >
                View All
              </Link>
            )}
          </div>
          <p className="mb-4 text-sm text-gray-500">
            City rides that deliver smooth and smart performance
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {filteredScooters
              .filter((s) => s.tags?.includes("top"))
              .map((scooter) => (
                <VehicleCard
                  key={scooter.id + "-top"}
                  vehicle={scooter}
                  type="scooter"
                />
              ))}
          </div>
        </section>
      )}

      {filteredScooters.some((s) => s.tags?.includes("just-added")) && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">🆕 Just Added</h2>
            {searchParams?.get("tag") !== "just-added" && (
              <Link
                href="/dashboard/scooters?tag=just-added"
                className="text-sm text-blue-500 hover:underline"
              >
                View All
              </Link>
            )}
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Discover our newest smart commuters
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {filteredScooters
              .filter((s) => s.tags?.includes("just-added"))
              .map((scooter) => (
                <VehicleCard
                  key={scooter.id + "-new"}
                  vehicle={scooter}
                  type="scooter"
                />
              ))}
          </div>
        </section>
      )}

      {filteredScooters.some((s) => s.tags?.includes("electric")) && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">⚡ Electric Picks</h2>
            {searchParams?.get("tag") !== "electric" && (
              <Link
                href="/dashboard/scooters?tag=electric"
                className="text-sm text-blue-500 hover:underline"
              >
                View All
              </Link>
            )}
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Eco-friendly rides for your daily commute
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {filteredScooters
              .filter((s) => s.tags?.includes("electric"))
              .map((scooter) => (
                <VehicleCard
                  key={scooter.id + "-ev"}
                  vehicle={scooter}
                  type="scooter"
                />
              ))}
          </div>
        </section>
      )}

      <div className="block md:hidden">
        <BottomNavigation activeTab="home" />
      </div>
    </main>
  );
}
