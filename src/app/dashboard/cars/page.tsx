"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brand } from "../../../../types";
import BrandButton from "../../../../components/BrandButton";
import VehicleCard from "../../../../components/VehicleCard";
import BottomNavigation from "../../../../components/BottomNavigation";
import Searchbox from "../../../../components/Searchbox";

type Car = {
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

export default function CarDashboard() {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      const res = await fetch("/api/vehicles/all");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCars(data.filter((c) => c.type === "car"));
      }
    };
    fetchCars();
  }, []);

  const brands: Brand[] = [
    { id: 1, name: "Tesla", logo: "/images/tesla.jpg" },
    { id: 2, name: "Lamborghini", logo: "/images/lamb.jpg" },
    { id: 3, name: "BMW", logo: "/images/bmw.jpg" },
    { id: 4, name: "Ferrari", logo: "/images/ferr.jpg" },
  ];

  return (
    <main className="min-h-screen px-6 pb-20 text-gray-900 pt-28 bg-gradient-to-b from-white via-slate-100 to-white">
      <div className="mb-8">
        <Searchbox />
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-gray-700">Car Brands</h2>
        <div className="flex gap-5 pb-2 overflow-x-auto no-scrollbar">
          {brands.map((brand) => (
            <BrandButton key={brand.id} brand={brand} />
          ))}
        </div>
      </section>

      {/* 🚘 Top Picks */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">🚘 Top Rated Cars</h2>
          <Link href="/cars" className="text-sm text-blue-500 hover:underline">
            View All
          </Link>
        </div>
        <p className="mb-4 text-sm text-gray-500">
          Hand-picked for performance and comfort
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {cars.filter((car) => car.tags.includes("top")).length > 0 ? (
            cars
              .filter((car) => car.tags.includes("top"))
              .map((car) => <VehicleCard key={car.id + "-top"} vehicle={car} />)
          ) : (
            <p className="text-sm text-red-500 col-span-full">
              No top-rated cars available.
            </p>
          )}
        </div>
      </section>

      {/* 🚀 Just Added */}
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
          {cars.filter((car) => car.tags.includes("just-added")).length > 0 ? (
            cars
              .filter((car) => car.tags.includes("just-added"))
              .map((car) => <VehicleCard key={car.id + "-new"} vehicle={car} />)
          ) : (
            <p className="text-sm text-red-500 col-span-full">
              No recently added cars available.
            </p>
          )}
        </div>
      </section>

      {/* 🔋 Electric Picks */}
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
          {cars.filter((car) => car.tags.includes("electric")).length > 0 ? (
            cars
              .filter((car) => car.tags.includes("electric"))
              .map((car) => <VehicleCard key={car.id + "-ev"} vehicle={car} />)
          ) : (
            <p className="text-sm text-red-500 col-span-full">
              No electric cars available.
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
