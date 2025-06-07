"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Brand } from "../../../../types";
import BrandButton from "../../../../components/BrandButton";
import VehicleCard from "../../../../components/VehicleCard";
import BottomNavigation from "../../../../components/BottomNavigation";
import Searchbox from "../../../../components/Searchbox";
import Spinner from "@/app/icons/spinner";
import { useSearchParams } from "next/navigation";

type Car = {
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

export default function CarDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      setLoading(true);
      fetchCars();
    });
  }, [searchParams]);

  useEffect(() => {
    fetchCars();
  }, [searchParams]);
  async function fetchCars(): Promise<void> {
    try {
      const params = new URLSearchParams(searchParams?.toString());
      params.set("type", "car"); // always enforce 'car'

      const res = await fetch(`/api/vehicles/all?${params.toString()}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setCars(data);

        // Dynamically extract brand list with images
        const uniqueBrandsMap = new Map<string, Brand>();
        data.forEach((car) => {
          if (!uniqueBrandsMap.has(car.brand)) {
            uniqueBrandsMap.set(car.brand, {
              id: uniqueBrandsMap.size + 1,
              name: car.brand,
              logo: car.images[0] || "",
            });
          }
        });

        setBrands(Array.from(uniqueBrandsMap.values()));
      }
    } catch (error) {
      console.error("Error loading cars", error);
    } finally {
      setTimeout(() => setLoading(false), 200);
    }
  }

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
        <Searchbox type="car" />
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Car Brands</h2>
        <div className="flex gap-5 pb-2 overflow-x-auto no-scrollbar">
          {brands.map((brand) => (
            <BrandButton key={brand.id} brand={brand} type="car" />
          ))}
        </div>
      </section>

      {/* 🚘 Top Picks */}
      {/* 🚘 Top Picks */}
      {cars.some((car) => car.tags.includes("top")) && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">🚘 Top Rated Cars</h2>
            <Link
              href="/cars"
              className="text-sm text-blue-500 hover:underline"
            >
              View All
            </Link>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Hand-picked for performance and comfort
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {cars
              .filter((car) => car.tags.includes("top"))
              .map((car) => (
                <VehicleCard key={car.id + "-top"} vehicle={car} />
              ))}
          </div>
        </section>
      )}

      {/* 🚀 Just Added */}
      {cars.some((car) => car.tags.includes("just-added")) && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">🚀 Just Added</h2>
            <Link
              href="/cars?sort=new"
              className="text-sm text-blue-500 hover:underline"
            >
              View All
            </Link>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Explore the latest arrivals to our garage
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {cars
              .filter((car) => car.tags.includes("just-added"))
              .map((car) => (
                <VehicleCard key={car.id + "-new"} vehicle={car} />
              ))}
          </div>
        </section>
      )}

      {/* 🔋 Electric Picks */}
      {cars.some((car) => car.tags.includes("electric")) && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">🔋 Electric Picks</h2>
            <Link
              href="/cars?filter=electric"
              className="text-sm text-blue-500 hover:underline"
            >
              View All
            </Link>
          </div>
          <p className="mb-4 text-sm text-gray-500">
            Zero-emission rides for the future
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {cars
              .filter((car) => car.tags.includes("electric"))
              .map((car) => (
                <VehicleCard key={car.id + "-ev"} vehicle={car} />
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
