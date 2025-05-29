"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Spinner from "@/app/icons/spinner";

export default function BikeDetailPage() {
  const params = useParams();
  const bikeId = Array.isArray(params?.bikeId)
    ? params.bikeId[0]
    : params?.bikeId;

  const router = useRouter();
  const [bike, setBike] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fakeBikes = [
      {
        id: "1",
        name: "Royal Enfield Hunter",
        image: "/images/dash-royal.jpg",
        gallery: [
          "/images/bike-1.jpg",
          "/images/bike-2.jpg",
          "/images/bike-3.jpg",
        ],
        rating: 4.9,
        location: "Bhalwari, Nepal",
        seats: 2,
        price: 1500,
        description:
          "A classic ride blending vintage charm with modern power. Perfect for long rides and rugged roads.",
      },
    ];

    const found = fakeBikes.find((b) => b.id === bikeId);
    setBike(found);
    setLoading(false);
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
          src={bike.image}
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
        {bike.gallery?.map((img: string, idx: number) => (
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

        <button className="w-full py-2 mt-4 font-semibold text-white transition bg-blue-600 rounded hover:bg-blue-700">
          Book Now
        </button>
      </div>
    </main>
  );
}
