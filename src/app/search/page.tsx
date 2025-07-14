"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowLeft,
  SlidersHorizontal,
  MoreVertical,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Brand, Car } from "../../../types";
import BrandFilter from "../../../components/BrandFilter";
import CarCard from "../../../components/VehicleCard";
import BottomNavigation from "../../../components/BottomNavigation";
import Spinner from "@/app/icons/spinner";

export default function SearchPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [vehicles, setVehicles] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const searchParams = useSearchParams();
  const selectedBrand = searchParams?.get("brand");
  const selectedType = searchParams?.get("type") || "car";

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/vehicles/all?type=${selectedType}`);
        const allData: Car[] = await res.json();
        if (!Array.isArray(allData)) return;

        const brandMap = new Map<string, Brand>();
        allData.forEach((item) => {
          const raw = item.brand?.trim();
          if (!raw) return;
          const key = raw.toLowerCase();
          if (!brandMap.has(key)) {
            brandMap.set(key, {
              id: brandMap.size + 1,
              name: raw,
              logo: item.images?.[0] || "/images/placeholder.jpg",
            });
          }
        });

        const allLogos: Record<string, string> = {
          car: "/images/all-cars.jpg",
          bike: "/images/all-bikes.jpg",
          scooter: "/images/all-scooters.jpg",
        };

        const brandList = [
          {
            id: 0,
            name: "ALL",
            logo: allLogos[selectedType] || "/images/placeholder.jpg",
          },
          ...Array.from(brandMap.values()),
        ];

        setBrands(brandList);

        const filteredRes = await fetch(
          `/api/vehicles/all?${searchParams?.toString()}`
        );
        const filteredData: Car[] = await filteredRes.json();
        setVehicles(filteredData);
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchParams]);

  const filteredVehicles = vehicles.filter((item) => {
    const brandMatch =
      !selectedBrand || selectedBrand.toLowerCase() === "all"
        ? true
        : item.brand?.toLowerCase() === selectedBrand.toLowerCase();

    const searchMatch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return brandMatch && searchMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8 text-gray-600" />
      </div>
    );
  }

  return (
    <main className="flex flex-col min-h-screen pb-16 bg-white">
      <div className="flex items-center justify-between p-4 mt-6">
        <div className="flex items-center gap-4">
          <Link href="/home">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold">Search</h1>
        </div>
        <Link href="#">
          <MoreVertical size={24} />
        </Link>
      </div>

      <div className="flex items-center gap-2 px-6 pt-8 mb-8">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search your vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 pl-12 text-sm border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search
            className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2"
            size={18}
          />
        </div>
      </div>

      <div className="px-4 mb-6 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 pb-2">
          {brands.map((brand) => (
            <BrandFilter
              key={brand.id}
              brand={brand}
              type={selectedType as any}
            />
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            {selectedBrand ? selectedBrand.toUpperCase() : "ALL"}{" "}
            {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}s
          </h2>
          <p className="text-sm text-gray-500">
            {filteredVehicles.length} found
          </p>
        </div>

        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredVehicles.map((vehicle) => (
              <CarCard key={vehicle.id} vehicle={vehicle} search />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No vehicles found for this brand.</p>
        )}
      </div>
    </main>
  );
}
