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

type Bike = {
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
  fuel_type: string;
  color: string;
};

export default function BikeDashboard() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const selectedBrand = searchParams?.get("brand");
  const [searchQuery, setSearchQuery] = useState("");
  const tagFilter = searchParams?.get("tag");

  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      fetchBikes();
    });
  }, [searchParams]);

  const fetchBikes = async () => {
    try {
      const params = new URLSearchParams(searchParams?.toString());
      params.set("type", "bike");

      const res = await fetch(`/api/vehicles/all?${params.toString()}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        const bikeList = data.filter((v) => v.type === "bike");
        setBikes(bikeList);

        const brandMap = new Map<string, Brand>();
        bikeList.forEach((bike) => {
          const raw = bike.brand?.trim();
          if (!raw) return;
          const key = raw.toLowerCase();
          if (!brandMap.has(key)) {
            brandMap.set(key, {
              id: brandMap.size + 1,
              name: raw,
              logo: bike.images?.[0] || "/images/placeholder.jpg",
            });
          }
        });

        setBrands(Array.from(brandMap.values()));
      }
    } catch (error) {
      console.error("Error loading bikes", error);
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  };

  const filteredBikes = bikes.filter((bike) => {
    const matchesBrand =
      !selectedBrand || selectedBrand.toLowerCase() === "all"
        ? true
        : bike.brand?.toLowerCase() === selectedBrand.toLowerCase();

    const matchesSearch = bike.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesTag = tagFilter ? bike.tags.includes(tagFilter) : true;

    return matchesBrand && matchesSearch && matchesTag;
  });

  if (loading || isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8 text-gray-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6 pb-20 text-gray-900 pt-28 bg-gradient-to-b from-white via-slate-100 to-white">
      <div className="mb-8">
        <Searchbox type="bike" value={searchQuery} onChange={setSearchQuery} />
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">
          Bike Brands
        </h2>
        <div className="flex gap-5 pb-2 overflow-x-auto no-scrollbar">
          {brands.map((brand) => (
            <BrandButton key={brand.id} brand={brand} type="bike" />
          ))}
        </div>
      </section>

      {filteredBikes.some((b) => b.tags?.includes("top")) && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">🏍️ Top Rated Bikes</h2>
            {searchParams?.get("tag") !== "top" && (
              <Link
                href="/dashboard/bikes?tag=top"
                className="text-sm text-blue-500 hover:underline"
              >
                View All
              </Link>
            )}
          </div>
          <p className="mb-4 text-sm text-gray-500">
            High-performance machines for enthusiasts
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {filteredBikes
              .filter((bike) => bike.tags?.includes("top"))
              .map((bike) => (
                <VehicleCard
                  key={bike.id + "-top"}
                  vehicle={bike}
                  type="bike"
                />
              ))}
          </div>
        </section>
      )}

      {filteredBikes.some((b) => b.tags?.includes("just-added")) && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">🆕 Just Added</h2>
            {searchParams?.get("tag") !== "just-added" && (
              <Link
                href="/dashboard/bikes?tag=just-added"
                className="text-sm text-blue-500 hover:underline"
              >
                View All
              </Link>
            )}
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Explore the newest two-wheelers
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {filteredBikes
              .filter((bike) => bike.tags?.includes("just-added"))
              .map((bike) => (
                <VehicleCard
                  key={bike.id + "-new"}
                  vehicle={bike}
                  type="bike"
                />
              ))}
          </div>
        </section>
      )}

      {filteredBikes.some((b) => b.tags?.includes("electric")) && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">⚡ Electric Bikes</h2>
            {searchParams?.get("tag") !== "electric" && (
              <Link
                href="/dashboard/bikes?tag=electric"
                className="text-sm text-blue-500 hover:underline"
              >
                View All
              </Link>
            )}
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Eco-friendly and efficient rides
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {filteredBikes
              .filter((bike) => bike.tags?.includes("electric"))
              .map((bike) => (
                <VehicleCard key={bike.id + "-ev"} vehicle={bike} type="bike" />
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
