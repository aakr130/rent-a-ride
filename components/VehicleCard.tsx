"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Car } from "../types";

interface VehicleCardProps {
  vehicle: Car;
  search?: boolean;
  type?: "car" | "bike" | "scooter";
}

export default function VehicleCard({
  vehicle,
  search = false,
  type = "car",
}: VehicleCardProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const detailLink = `/dashboard/${type}s/${vehicle.id}`; // ✅ handles /cars/, /bikes/, /scooters/

  return (
    <Link href={detailLink} className="block mb-1 font-medium hover:underline">
      <div className="relative overflow-hidden cursor-pointer bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.01]">
        {/* Image */}
        <div className="relative h-40">
          <Image
            src={vehicle.images?.[0] || "/images/placeholder.jpg"}
            alt={vehicle.name}
            fill
            className="object-cover"
          />

          <button
            className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow"
            onClick={(e) => {
              e.preventDefault(); // prevent navigation when toggling favorite
              setIsFavorite(!isFavorite);
            }}
            aria-label="Toggle Favorite"
          >
            <Heart size={16} fill={isFavorite ? "black" : "none"} />
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          {vehicle.name}

          <div className="flex items-center gap-1 mb-1">
            <span className="text-sm">{vehicle.rating}</span>
            <Image src="/images/star.png" alt="Rating" width={12} height={12} />
          </div>

          {vehicle.location && (
            <div className="flex items-center gap-1 mb-2 text-xs text-gray-500">
              <Image
                src="/images/location.jpg"
                alt="Location"
                width={12}
                height={12}
              />
              <span>{vehicle.location}</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
            {vehicle.seats && (
              <div className="flex items-center gap-1">
                <Image
                  src="/images/car-seat.jpg"
                  alt="Seats"
                  width={12}
                  height={12}
                />
                <span>{vehicle.seats} Seats</span>
              </div>
            )}
            <div className="ml-auto font-medium text-right">
              Rs.{vehicle.price}/Day
            </div>
          </div>

          {search && (
            <div className="flex items-center justify-between mt-2">
              <div className="font-medium">Rs.{vehicle.price}/Day</div>
              {vehicle.hasBookNow && (
                <Link
                  href={detailLink}
                  className="bg-black text-white text-xs px-3 py-1.5 rounded-full hover:bg-gray-800 transition"
                >
                  Book now
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
