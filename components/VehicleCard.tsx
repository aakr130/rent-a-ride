"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Car } from "../types";
import { useWishlist } from "@/context/WishlistContext";

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
  const router = useRouter();
  const detailLink = `/dashboard/${type}s/${vehicle.id}`;
  const { toggleItem, isWishlisted } = useWishlist();
  const isFavorite = isWishlisted(vehicle.id);

  return (
    <div
      className="block transition-transform duration-200 hover:scale-[1.01] cursor-pointer"
      onClick={() => router.push(detailLink)}
    >
      <div className="overflow-hidden bg-white border shadow-sm rounded-xl hover:shadow-md">
        {/* Image */}
        <div className="relative w-full h-40">
          <Image
            src={vehicle.images?.[0] || "/images/placeholder.jpg"}
            alt={vehicle.name}
            fill
            className="object-cover"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleItem(vehicle);
            }}
            className="absolute top-2 right-2 bg-white rounded-full cursor-pointer p-1.5 shadow hover:scale-110 transition"
          >
            <Heart size={16} fill={isFavorite ? "#FF0000" : "none"} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <div className="text-xs font-semibold text-blue-600 uppercase">
            {vehicle.brand}
          </div>
          <div className="text-sm font-medium text-gray-900 line-clamp-1">
            {vehicle.name}
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>{vehicle.rating}</span>
            <Image src="/images/star.png" alt="Rating" width={12} height={12} />
          </div>

          {vehicle.location && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Image
                src="/images/location.jpg"
                alt="Location"
                width={12}
                height={12}
              />
              <span className="truncate">{vehicle.location}</span>
            </div>
          )}

          {/* Detailed Labels */}
          <div className="flex flex-col gap-1 mt-2 text-xs text-gray-600">
            {vehicle.fuel_type && (
              <div className="flex items-center gap-2">
                ⛽ <span className="font-medium">Fuel Type:</span>{" "}
                {vehicle.fuel_type}
              </div>
            )}
            {vehicle.color && (
              <div className="flex items-center gap-2">
                🎨 <span className="font-medium">Color:</span> {vehicle.color}
              </div>
            )}
          </div>

          {/* Seats and Price */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-700">
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
            <div className="ml-auto font-semibold text-right">
              Rs.{vehicle.price}/Day
            </div>
          </div>

          {/* {search && (
            <div
              className="flex items-center justify-between pt-2 mt-3 text-sm border-t"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-medium text-gray-800">
                Rs.{vehicle.price}/Day
              </span>
              <Link
                href={detailLink}
                className="px-3 py-1 text-xs text-white transition bg-black rounded-full hover:bg-gray-800"
              >
                Book now
              </Link>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
