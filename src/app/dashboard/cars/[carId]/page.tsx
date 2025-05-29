"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Spinner from "@/app/icons/spinner";

const allCars = [
  {
    id: "1",
    name: "Ferrari-FF",
    image: "/images/dash-ferr.jpg",
    gallery: ["/images/car-1.jpg", "/images/car-2.jpg", "/images/car-3.jpg"],
    rating: 5.0,
    location: "Jogikuti ,Nepal",
    seats: 4,
    price: 5000,
    description:
      "The Ferrari FF combines breathtaking speed with versatile four-seat practicality. Ideal for thrilling journeys and bold impressions.",
  },
  {
    id: "2",
    name: "Tesla Model S",
    image: "/images/dash-tesla.jpg",
    gallery: [
      "/images/dash-tesla.jpg",
      "/images/dash-tesla.jpg",
      "/images/tesla-3.jpg",
    ],
    rating: 5.0,
    location: "Drivertole, Nepal",
    seats: 5,
    price: 7000,
    description:
      "Experience the future with the Tesla Model S – luxury, performance, and sustainability in one electric powerhouse.",
  },
  {
    id: "3",
    name: "Hyundai Elantra",
    image: "/images/dash-hyundai.jpg",
    gallery: [
      "/images/hyundai-1.jpg",
      "/images/hyundai-2.jpg",
      "/images/hyundai-3.jpg",
    ],
    rating: 4.8,
    location: "ShankarNagar, Nepal",
    seats: 5,
    price: 3000,
    description:
      "A reliable and stylish companion for daily drives and weekend getaways. Comfort, efficiency, and elegance in one.",
  },
];

export default function CarDetailPage() {
  const params = useParams();
  const carId = Array.isArray(params?.carId) ? params.carId[0] : params?.carId;
  const router = useRouter();
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = allCars.find((c) => c.id === carId);
    setCar(found);
    setLoading(false);
  }, [carId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="w-8 h-8 text-gray-600" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Car not found.</p>
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
          src={car.image}
          alt={car.name}
          width={1000}
          height={400}
          className="w-full h-[300px] object-contain bg-white"
        />
        <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-end px-6 py-4 bg-gradient-to-t from-black/60 to-transparent">
          <h1 className="text-2xl font-bold text-white">{car.name}</h1>
          <p className="text-sm text-white">{car.location}</p>
        </div>
      </div>

      {/* Gallery */}
      <div className="flex gap-4 pb-2 mb-6 overflow-x-auto">
        {car.gallery?.map((img: string, idx: number) => (
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
            <p>{car.rating}</p>
          </div>
          <div>
            <p className="font-semibold">🪑 Seats</p>
            <p>{car.seats}</p>
          </div>
          <div>
            <p className="font-semibold">💵 Price</p>
            <p>Rs. {car.price}/Day</p>
          </div>
        </div>

        <p className="text-gray-600">{car.description}</p>

        <button className="w-full py-2 mt-4 font-semibold text-white transition bg-blue-600 rounded hover:bg-blue-700">
          Book Now
        </button>
      </div>
    </main>
  );
}
