"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowLeft,
  SlidersHorizontal,
  MoreVertical,
} from "lucide-react";
import { Brand, Car } from "../../../types";
import BrandFilter from "../../../components/BrandFilter";
import CarCard from "../../../components/VehicleCard";
import BottomNavigation from "../../../components/BottomNavigation";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const brands: Brand[] = [
    { id: 0, name: "ALL", logo: "https://placehold.co/60x60/222/fff?text=ALL" },
    {
      id: 1,
      name: "Ferrari",
      logo: "https://placehold.co/60x60/222/fff?text=F",
    },
    { id: 2, name: "Tesla", logo: "https://placehold.co/60x60/222/fff?text=T" },
    { id: 3, name: "BMW", logo: "https://placehold.co/60x60/222/fff?text=B" },
    {
      id: 4,
      name: "Lamborghini",
      logo: "https://placehold.co/60x60/222/fff?text=L",
    },
  ];

  const recommendedCars: Car[] = [
    {
      id: 1,
      name: "Tesla Model S",
      images: ["https://placehold.co/600x400/222/fff?text=Tesla+Model+S"],
      rating: 5.0,
      location: "Chicago, USA",
      price: 100,
      hasBookNow: true,
    },
    {
      id: 2,
      name: "Ferrari LaFerrari",
      images: ["https://placehold.co/600x400/222/fff?text=Ferrari+LaFerrari"],
      rating: 5.0,
      location: "Washington DC",
      price: 100,
      hasBookNow: true,
    },
    {
      id: 3,
      name: "Lamborghini Aventador",
      images: [
        "https://placehold.co/600x400/222/fff?text=Lamborghini+Aventador",
      ],
      rating: 4.9,
      location: "Washington DC",
      price: 100,
      hasBookNow: true,
    },
    {
      id: 4,
      name: "BMW GT3 M2",
      images: ["https://placehold.co/600x400/222/fff?text=BMW+GT3+M2"],
      rating: 5.0,
      location: "New York, USA",
      price: 100,
      hasBookNow: true,
    },
  ];

  const popularCars: Car[] = [
    {
      id: 5,
      name: "Ferrari LaFerrari",
      images: [
        "https://placehold.co/600x400/222/fff?text=Ferrari+LaFerrari+White",
      ],
      rating: 5.0,
      price: 100,
      hasBookNow: false,
    },
  ];

  return (
    <main className="flex flex-col min-h-screen pb-16 bg-white">
      <div className="flex items-center justify-between p-4">
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

      <div className="flex items-center gap-2 px-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search your dream car...."
            className="pl-10 input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search
            className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
            size={20}
          />
        </div>

        <Link href="/filters" className="p-3 bg-gray-100 rounded-lg">
          <SlidersHorizontal size={20} />
        </Link>
      </div>

      <div className="px-4 mb-6 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {brands.map((brand) => (
            <BrandFilter key={brand.id} brand={brand} />
          ))}
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recommend For You</h2>
          <Link href="/recommended" className="text-sm text-gray-500">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {recommendedCars.map((car) => (
            <CarCard key={car.id} vehicle={car} search />
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Our Popular Cars</h2>
          <Link href="/popular" className="text-sm text-gray-500">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {popularCars.map((car) => (
            <CarCard key={car.id} vehicle={car} search />
          ))}
        </div>
      </div>

      <BottomNavigation activeTab="search" />
    </main>
  );
}
