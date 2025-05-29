"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Spinner from "@/app/icons/spinner";
import { ArrowLeft } from "lucide-react";

export default function ScooterDetailPage() {
  const params = useParams();
  const scooterId = Array.isArray(params?.scooterId)
    ? params.scooterId[0]
    : params?.scooterId;
  const router = useRouter();
  const [scooter, setScooter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const allScooters = [
      {
        id: "1",
        name: "Honda Dio",
        image: "/images/dio.png",
        gallery: [
          "/images/scooter-1.jpg",
          "/images/scooter-2.jpg",
          "/images/scooter-3.jpg",
        ],
        rating: 4.9,
        location: "Butwal, Nepal",
        price: 900,
        description:
          "Compact, efficient and stylish for urban commuting. Perfect for weaving through city streets with ease.",
      },
      {
        id: "2",
        name: "Vespa Elegante",
        image: "/images/vespa.jpg",
        gallery: [
          "/images/vespa-1.jpg",
          "/images/vespa-2.jpg",
          "/images/vespa-3.jpg",
        ],
        rating: 4.8,
        location: "Pokhara, Nepal",
        price: 1200,
        description:
          "Elegant design with premium finish and powerful engine. Ideal for stylish rides around town.",
      },
      {
        id: "3",
        name: "TVS Jupiter",
        image: "/images/tvs.jpg",
        gallery: [
          "/images/tvs-1.jpg",
          "/images/tvs-2.jpg",
          "/images/tvs-3.jpg",
        ],
        rating: 4.7,
        location: "Kathmandu, Nepal",
        price: 1000,
        description:
          "Balanced ride offering excellent mileage, comfort and practicality for daily commutes.",
      },
    ];

    const found = allScooters.find((s) => s.id === scooterId);
    setScooter(found);
    setLoading(false);
  }, [scooterId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="w-8 h-8 text-gray-600" />
      </div>
    );
  }

  if (!scooter) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Scooter not found.</p>
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

      {/* Hero Image */}
      <div className="relative w-full mt-10 mb-4 overflow-hidden bg-white shadow rounded-xl">
        <Image
          src={scooter.image}
          alt={scooter.name}
          width={1000}
          height={400}
          className="w-full h-[300px] object-contain bg-white"
        />
        <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-end px-6 py-4 bg-gradient-to-t from-black/60 to-transparent">
          <h1 className="text-2xl font-bold text-white">{scooter.name}</h1>
          <p className="text-sm text-white">{scooter.location}</p>
        </div>
      </div>

      {/* Gallery */}
      <div className="flex gap-4 pb-2 mb-6 overflow-x-auto">
        {scooter.gallery?.map((img: string, idx: number) => (
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
            <p>{scooter.rating}</p>
          </div>
          <div>
            <p className="font-semibold">📍 Location</p>
            <p>{scooter.location}</p>
          </div>
          <div>
            <p className="font-semibold">💵 Price</p>
            <p>Rs. {scooter.price}/Day</p>
          </div>
        </div>

        <p className="text-gray-600">{scooter.description}</p>

        <button className="w-full py-2 mt-4 font-semibold text-white transition bg-blue-600 rounded hover:bg-blue-700">
          Book Now
        </button>
      </div>
    </main>
  );
}
