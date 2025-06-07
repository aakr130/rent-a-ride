"use client";

import { useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Slider } from "@/components/ui/slider";

export default function FilterDialog() {
  const [options, setOptions] = useState({
    colors: [] as string[],
    fuelTypes: [] as string[],
    rentalTimes: [] as string[],
    seats: [] as number[],
    locations: [] as string[],
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const res = await fetch("/api/vehicles/options");
        const data = await res.json();
        setOptions(data);
      } catch (e) {
        console.error("Failed to load filter options", e);
      }
    };
    loadOptions();
  }, []);

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [priceRange, setPriceRange] = useState<[number, number]>([10, 230]);
  const [rentalTime, setRentalTime] = useState<string | null>(null);
  const [carLocation, setCarLocation] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [sittingCapacity, setSittingCapacity] = useState<number | null>(null);
  const [fuelType, setFuelType] = useState<string | null>(null);

  const clearFilters = () => {
    setPriceRange([10, 230]);
    setRentalTime(null);
    setCarLocation("");
    setSelectedColor(null);
    setSittingCapacity(null);
    setFuelType(null);
  };

  const applyFilters = () => {
    const query = new URLSearchParams();

    if (rentalTime) query.set("rental_time", rentalTime);
    if (sittingCapacity) query.set("seats", sittingCapacity.toString());
    if (fuelType) query.set("fuel_type", fuelType);
    if (carLocation) query.set("location", carLocation);
    if (selectedColor) query.set("color", selectedColor);
    query.set("price_min", priceRange[0].toString());
    query.set("price_max", priceRange[1].toString());

    router.push(`/dashboard/cars?${query.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });

    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button
          className="p-3 transition bg-gray-100 rounded-lg hover:bg-gray-200"
          aria-label="Open filters"
        >
          <SlidersHorizontal size={20} />
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <AlertDialogHeader>
          <div className="flex items-center justify-between w-full">
            <AlertDialogTitle className="text-xl font-bold">
              Filters
            </AlertDialogTitle>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 transition hover:text-black"
            >
              <X className="w-5 h-5 cursor-pointer" />
            </button>
          </div>
        </AlertDialogHeader>

        <div className="mt-4 space-y-6">
          {/* Price Range */}
          <div>
            <h2 className="mb-2 font-medium">Price Range</h2>
            <Slider
              min={500}
              max={10000}
              step={10}
              value={priceRange}
              onValueChange={(val) => setPriceRange(val as [number, number])}
              className="w-full"
            />
            <div className="flex justify-between mt-1 text-sm">
              <span>Rs{priceRange[0]}</span>
              <span>Rs{priceRange[1]}+</span>
            </div>
          </div>

          {/* Rental Time */}
          <div>
            <h2 className="mb-2 font-medium">Rental Time</h2>
            <div className="flex flex-wrap gap-2">
              {options.rentalTimes.map((time) => (
                <button
                  key={time}
                  className={`px-4 py-2 rounded-full text-sm ${
                    rentalTime === time
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black"
                  }`}
                  onClick={() =>
                    setRentalTime(rentalTime === time ? null : time)
                  }
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="mb-2 font-medium">Location</h2>
            <div className="flex flex-wrap gap-2">
              {options.locations.map((location) => (
                <button
                  key={location}
                  className={`px-4 py-2 rounded-full text-sm ${
                    carLocation === location
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black"
                  }`}
                  onClick={() =>
                    setCarLocation(carLocation === location ? "" : location)
                  }
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h2 className="mb-2 font-medium">Colors</h2>
            <div className="flex gap-3">
              {options.colors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border ${
                    color === "white"
                      ? "bg-white border-gray-300"
                      : `bg-${color}-500`
                  } ${
                    selectedColor === color
                      ? "ring-2 ring-offset-2 ring-black"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedColor(selectedColor === color ? null : color)
                  }
                />
              ))}
            </div>
          </div>

          {/* Sitting Capacity */}
          <div>
            <h2 className="mb-2 font-medium">Sitting Capacity</h2>
            <div className="flex gap-2">
              {options.seats.map((c) => (
                <button
                  key={c}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    sittingCapacity === c
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black"
                  }`}
                  onClick={() =>
                    setSittingCapacity(sittingCapacity === c ? null : c)
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Fuel Type */}
          <div>
            <h2 className="mb-2 font-medium">Fuel Type</h2>
            <div className="flex flex-wrap gap-2">
              {options.fuelTypes.map((fuel) => (
                <button
                  key={fuel}
                  className={`px-4 py-2 rounded-full text-sm ${
                    fuelType === fuel
                      ? "bg-black text-white"
                      : "bg-gray-100 text-black"
                  }`}
                  onClick={() => setFuelType(fuelType === fuel ? null : fuel)}
                >
                  {fuel}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between pt-4 border-t">
            <button
              className="text-sm text-gray-600 cursor-pointer"
              onClick={clearFilters}
            >
              Clear All
            </button>
            <button
              onClick={applyFilters}
              className="px-6 py-2 text-sm text-white bg-black rounded-full cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
