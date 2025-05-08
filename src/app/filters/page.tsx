"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import {
  CarType,
  ColorOption,
  FuelOption,
  RentalTimeOption,
} from "../../../types";

export default function FiltersPage() {
  const [carType, setCarType] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 230]);
  const [rentalTime, setRentalTime] = useState<string>("day");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [carLocation, setCarLocation] = useState<string>(
    "Shore Dr, Chicago 0062 Usa"
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sittingCapacity, setSittingCapacity] = useState<number>(4);
  const [fuelType, setFuelType] = useState<string>("electric");

  const carTypes: CarType[] = [
    { id: "all", name: "All Cars" },
    { id: "regular", name: "Regular Cars" },
    { id: "luxury", name: "Luxury Cars" },
  ];

  const rentalTimeOptions: RentalTimeOption[] = [
    { id: "hour", name: "Hour" },
    { id: "day", name: "Day" },
    { id: "weekly", name: "Weekly" },
    { id: "monthly", name: "Monthly" },
  ];

  const colorOptions: ColorOption[] = [
    { id: "white", name: "White", color: "bg-white border" },
    { id: "gray", name: "Gray", color: "bg-gray-400" },
    { id: "blue", name: "Blue", color: "bg-blue-600" },
    { id: "black", name: "Black", color: "bg-black" },
  ];

  const capacityOptions: number[] = [2, 4, 6, 8];

  const fuelOptions: FuelOption[] = [
    { id: "electric", name: "Electric" },
    { id: "petrol", name: "Petrol" },
    { id: "diesel", name: "Diesel" },
    { id: "hybrid", name: "Hybrid" },
  ];

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const clearAllFilters = () => {
    setCarType("all");
    setPriceRange([10, 230]);
    setRentalTime("day");
    setSelectedDate(null);
    setCarLocation("Shore Dr, Chicago 0062 Usa");
    setSelectedColor(null);
    setSittingCapacity(4);
    setFuelType("electric");
  };

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="p-4 flex items-center justify-between border-b">
        <Link href="/search">
          <X size={24} />
        </Link>
        <h1 className="font-bold text-xl">Filters</h1>
        <div className="w-6"></div>
      </div>

      <div className="flex-1 p-4 space-y-6 overflow-auto">
        <div>
          <h2 className="font-medium mb-3">Type of Cars</h2>
          <div className="flex gap-3 flex-wrap">
            {carTypes.map((type) => (
              <button
                key={type.id}
                className={`px-4 py-2 rounded-full text-sm ${
                  carType === type.id
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black"
                }`}
                onClick={() => setCarType(type.id)}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-medium mb-3">Price range</h2>
          <div className="px-2">
            <div className="h-24 bg-gray-100 rounded-lg mb-2 relative">
              {/* Price range histogram visualization would go here */}
              <div className="absolute inset-x-4 top-1/2 h-1 bg-gray-300 rounded"></div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-300 rounded-full"
                style={{ left: `${((priceRange[0] - 10) / 220) * 100}%` }}
              ></div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-gray-300 rounded-full"
                style={{ left: `${((priceRange[1] - 10) / 220) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between">
              <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                ${priceRange[0]}
              </div>
              <div className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                ${priceRange[1]}+
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-medium mb-3">Rental Time</h2>
          <div className="flex gap-3 flex-wrap">
            {rentalTimeOptions.map((option) => (
              <button
                key={option.id}
                className={`px-6 py-2 rounded-full text-sm ${
                  rentalTime === option.id
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black"
                }`}
                onClick={() => setRentalTime(option.id)}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-medium mb-3">Pick up and Drop Date</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value="05/Jun/2024"
              readOnly
              className="input-field"
            />
            <Image
              src="/images/calendar.png"
              alt="Calendar"
              width={24}
              height={24}
            />
          </div>
        </div>

        <div>
          <h2 className="font-medium mb-3">Car Location</h2>
          <div className="relative">
            <input
              type="text"
              value={carLocation}
              onChange={(e) => setCarLocation(e.target.value)}
              className="input-field pl-10"
            />
            <Image
              src="/images/location.png"
              alt="Location"
              width={20}
              height={20}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium">Colors</h2>
            <Link href="#" className="text-sm text-gray-500">
              See All
            </Link>
          </div>
          <div className="flex gap-4">
            {colorOptions.map((color) => (
              <button
                key={color.id}
                className={`w-8 h-8 rounded-full ${
                  color.color
                } flex items-center justify-center ${
                  selectedColor === color.id
                    ? "ring-2 ring-offset-2 ring-black"
                    : ""
                }`}
                onClick={() => setSelectedColor(color.id)}
              >
                {selectedColor === color.id && (
                  <div className="w-2 h-2 rounded-full bg-black"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-medium mb-3">Siting Capacity</h2>
          <div className="flex gap-3">
            {capacityOptions.map((capacity) => (
              <button
                key={capacity}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  sittingCapacity === capacity
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black"
                }`}
                onClick={() => setSittingCapacity(capacity)}
              >
                {capacity}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-medium mb-3">Fuel Type</h2>
          <div className="flex gap-3 flex-wrap">
            {fuelOptions.map((option) => (
              <button
                key={option.id}
                className={`px-6 py-2 rounded-full text-sm ${
                  fuelType === option.id
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black"
                }`}
                onClick={() => setFuelType(option.id)}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t flex justify-between">
        <button className="text-black font-medium" onClick={clearAllFilters}>
          Clear All
        </button>
        <Link href="/search" className="btn-primary px-8">
          Show 100+ Cars
        </Link>
      </div>
    </main>
  );
}
