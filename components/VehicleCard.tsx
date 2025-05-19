"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Car } from "../types";

interface VehicleCardProps {
  car: Car;
  search?: boolean;
  type?: "car" | "bike" | "scooter";
}

export default function VehicleCard({
  car,
  search = false,
  type = "car",
}: VehicleCardProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  return (
    <div className="relative overflow-hidden bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
      {/* Image */}
      <div className="relative h-40">
        <Image
          src={
            car.image ||
            `https://placehold.co/600x400/222/fff?text=${encodeURIComponent(
              car.name
            )}`
          }
          alt={car.name}
          fill
          className="object-cover"
        />
        <button
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow"
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label="Toggle Favorite"
        >
          <Heart size={16} fill={isFavorite ? "black" : "none"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <Link
          href={`/car/${car.id}`}
          className="block mb-1 font-medium hover:underline"
        >
          {car.name}
        </Link>

        <div className="flex items-center gap-1 mb-1">
          <span className="text-sm">{car.rating}</span>
          <Image src="/images/star.png" alt="Rating" width={12} height={12} />
        </div>

        {car.location && (
          <div className="flex items-center gap-1 mb-2 text-xs text-gray-500">
            <Image
              src="/images/location.jpg"
              alt="Location"
              width={12}
              height={12}
            />
            <span>{car.location}</span>
          </div>
        )}

        {/* Consistent Price Line */}
        <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
          {type === "car" && car.seats && (
            <div className="flex items-center gap-1">
              <Image
                src="/images/car-seat.jpg"
                alt="Seats"
                width={12}
                height={12}
              />
              <span>{car.seats} Seats</span>
            </div>
          )}
          {/* Always show price aligned right */}
          <div className="ml-auto font-medium text-right">
            Rs.{car.price}/Day
          </div>
        </div>

        {search && (
          <div className="flex items-center justify-between mt-2">
            <div className="font-medium">Rs.{car.price}/Day</div>
            {car.hasBookNow && (
              <Link
                href={`/car/${car.id}`}
                className="bg-black text-white text-xs px-3 py-1.5 rounded-full hover:bg-gray-800 transition"
              >
                Book now
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
