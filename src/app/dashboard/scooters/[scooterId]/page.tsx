"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Spinner from "@/app/icons/spinner";
import { ArrowLeft } from "lucide-react";
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

export default function ScooterDetailPage() {
  const params = useParams();
  const scooterId = Array.isArray(params?.scooterId)
    ? parseInt(params.scooterId[0])
    : parseInt(params?.scooterId || "");

  const router = useRouter();
  const [scooter, setScooter] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScooter = async () => {
      try {
        const res = await fetch("/api/vehicles/all?type=scooter");
        const data = await res.json();

        if (Array.isArray(data)) {
          const found = data.find(
            (v: Vehicle) => v.id === scooterId && v.type === "scooter"
          );
          setScooter(found || null);
        }
      } catch (err) {
        console.error("Error fetching scooter data", err);
      } finally {
        setTimeout(() => setLoading(false), 300); // Ensures spinner displays at least briefly
      }
    };

    if (scooterId) fetchScooter();
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
    <main className="max-w-5xl px-4 py-10 mx-auto animate-fade-in">
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
          src={scooter.images?.[0] || "/images/placeholder.jpg"}
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
        {scooter.images?.map((img, idx) => (
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
            <p className="font-semibold">🪑 Seats</p>
            <p>{scooter.seats}</p>
          </div>
          <div>
            <p className="font-semibold">💵 Price</p>
            <p>Rs. {scooter.price}/Day</p>
          </div>
        </div>

        <p className="text-gray-600">{scooter.description}</p>

        <BookNowDialog vehicle={scooter} />
      </div>
    </main>
  );
}
