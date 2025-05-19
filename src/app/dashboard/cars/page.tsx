"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { Brand, Car } from "../../../../types";
import BrandButton from "../../../../components/BrandButton";
import CarCard from "../../../../components/VehicleCard";
import BottomNavigation from "../../../../components/BottomNavigation";
import VehicleCard from "../../../../components/VehicleCard";
import Searchbox from "../../../../components/Searchbox";

export default function CarDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const brands: Brand[] = [
    { id: 1, name: "Tesla", logo: "/images/tesla.jpg" },
    { id: 2, name: "Lamborghini", logo: "/images/lamb.jpg" },
    { id: 3, name: "BMW", logo: "/images/bmw.jpg" },
    { id: 4, name: "Ferrari", logo: "/images/ferr.jpg" },
  ];

  const allCars: Car[] = [
    {
      id: 1,
      name: "Ferrari-FF",
      image: "/images/dash-ferr.jpg",
      rating: 5.0,
      location: "Jogikuti ,Nepal",
      seats: 4,
      price: 5000,
    },
    {
      id: 2,
      name: "Tesla Model S",
      image: "/images/dash-tesla.jpg",
      rating: 5.0,
      location: "Drivertole, Nepal",
      seats: 5,
      price: 7000,
    },
    {
      id: 3,
      name: "Hyundai Elantra",
      image: "/images/dash-hyundai.jpg",
      rating: 4.8,
      location: "ShankarNagar, Nepal",
      seats: 5,
      price: 3000,
    },
    {
      id: 4,
      name: "Tesla Model S",
      image: "/images/dash-tesla.jpg",
      rating: 5.0,
      location: "Manglapur, Nepal",
      seats: 5,
      price: 7000,
    },
    {
      id: 5,
      name: "Ferrari-FF",
      image: "/images/dash-ferr.jpg",
      rating: 5.0,
      location: "Chandragiri, Nepal",
      seats: 4,
      price: 5000,
    },
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
          {allCars
            .filter((car) => car.rating >= 4.8)
            .map((car) => (
              <VehicleCard key={car.id + "-top"} car={car} />
            ))}
        </div>
      </section>

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
          {allCars.slice(0, 2).map((car) => (
            <VehicleCard key={car.id + "-new"} car={car} />
          ))}
        </div>
      </section>

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
          {allCars
            .filter((car) => car.name.toLowerCase().includes("tesla"))
            .map((car) => (
              <VehicleCard key={car.id + "-ev"} car={car} />
            ))}
        </div>
      </section>

      <div className="block md:hidden">
        <BottomNavigation activeTab="home" />
      </div>
    </main>
  );
}
