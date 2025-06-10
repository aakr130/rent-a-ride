"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Spinner from "@/app/icons/spinner";
import BookNowDialog from "../../../../../components/BookNowDialog";

type Vehicle = {
  id: number;
  name: string;
  images: string[];
  price: number;
  rating: number;
  seats: number;
  location: string;
  description: string;
  type: string;
  tags: string[];
};

export default function BikeDetailPage() {
  const params = useParams();
  const bikeId = Array.isArray(params?.bikeId)
    ? parseInt(params.bikeId[0])
    : parseInt(params?.bikeId || "");

  const router = useRouter();
  const [bike, setBike] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const res = await fetch("/api/vehicles/all?type=bike");

        const data = await res.json();

        if (Array.isArray(data)) {
          const found = data.find(
            (v: Vehicle) => v.id === bikeId && v.type === "bike"
          );

          setBike(found || null);
        }
      } catch (err) {
        console.error("Error fetching bike data", err);
      } finally {
        setLoading(false);
      }
    };

    if (bikeId) {
      fetchBike();
    }
  }, [bikeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="w-8 h-8 text-gray-600" />
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Bike not found.</p>
      </div>
    );
  }

  return (
    <main className="max-w-5xl px-4 py-10 mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed z-10 p-2 bg-white rounded-full shadow top-20 left-6 hover:bg-gray-100"
        aria-label="Go Back"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Hero Section */}
      <div className="relative w-full mt-10 mb-4 overflow-hidden bg-white shadow rounded-xl">
        <Image
          src={bike.images?.[0] || "/images/placeholder.jpg"}
          alt={bike.name}
          width={1000}
          height={400}
          className="w-full h-[300px] object-contain bg-white"
        />
        <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-end px-6 py-4 bg-gradient-to-t from-black/60 to-transparent">
          <h1 className="text-2xl font-bold text-white">{bike.name}</h1>
          <p className="text-sm text-white">{bike.location}</p>
        </div>
      </div>

      {/* Gallery */}
      <div className="flex gap-4 pb-2 mb-6 overflow-x-auto">
        {bike.images?.map((img: string, idx: number) => (
          <Image
            key={idx}
            src={img}
            alt={`Gallery ${idx + 1}`}
            width={140}
            height={90}
            className="object-cover rounded-lg shadow"
          />
        ))}
      </div>

      {/* Info Card */}
      <div className="p-6 space-y-4 bg-white border shadow rounded-xl">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 sm:grid-cols-3">
          <div>
            <p className="font-semibold">⭐ Rating</p>
            <p>{bike.rating}</p>
          </div>
          <div>
            <p className="font-semibold">🪑 Seats</p>
            <p>{bike.seats}</p>
          </div>
          <div>
            <p className="font-semibold">💵 Price</p>
            <p>Rs. {bike.price}/Day</p>
          </div>
        </div>

        <p className="text-gray-600">{bike.description}</p>

        <BookNowDialog vehicle={bike} />
      </div>
    </main>
  );
}
