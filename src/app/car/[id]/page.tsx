"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  MoreVertical,
  Phone,
  MessageSquare,
} from "lucide-react";
import { CarDetails } from "../../../../types";
import FeatureCard from "../../../../components/FeatureCard";
import ReviewCard from "../../../../components/ReviewCard";

interface CarDetailsPageProps {
  params: {
    id: string;
  };
}

export default function CarDetailsPage({ params }: CarDetailsPageProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const carImages: string[] = [
    "https://placehold.co/600x400/222/fff?text=Tesla+Model+S+Front",
    "https://placehold.co/600x400/222/fff?text=Tesla+Model+S+Interior",
    "https://placehold.co/600x400/222/fff?text=Tesla+Model+S+Back",
  ];

  const carDetails: CarDetails = {
    id: Number.parseInt(params.id),
    name: "Tesla Model S",
    description:
      "A car with high specs that are rented at an affordable price.",
    image: carImages[0],
    rating: 5.0,
    reviews: 100,
    price: 100,
    features: [
      { icon: "capacity", title: "Capacity", value: "5 Seats" },
      { icon: "engine", title: "Engine Out", value: "670 HP" },
      { icon: "speed", title: "Max Speed", value: "250km/h" },
      { icon: "autopilot", title: "Advance", value: "Autopilot" },
      { icon: "charge", title: "Single Charge", value: "405 Miles" },
      { icon: "parking", title: "Advance", value: "Auto Parking" },
    ],
    owner: {
      name: "Hela Quintin",
      verified: true,
      image: "https://placehold.co/100x100/222/fff?text=HQ",
    },
    reviewList: [
      {
        id: 1,
        name: "Mr. Jack",
        rating: 5.0,
        comment:
          "The rental car was clean, reliable, and the service was quick and efficient.",
        image: "https://placehold.co/100x100/222/fff?text=Jack",
      },
      {
        id: 2,
        name: "Robert",
        rating: 5.0,
        comment:
          "The rental car was clean, reliable, and the service was quick and efficient.",
        image: "https://placehold.co/100x100/222/fff?text=Robert",
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white flex flex-col pb-24">
      <div className="p-4 flex items-center justify-between">
        <Link href="/search" className="z-10">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-bold text-xl">Car Details</h1>
        <Link href="#" className="z-10">
          <MoreVertical size={24} />
        </Link>
      </div>

      <div className="relative mb-4">
        <div className="relative h-64 w-full">
          <Image
            src={carImages[activeImageIndex] || "/placeholder.svg"}
            alt={carDetails.name}
            fill
            className="object-cover"
          />
          <button
            className={`absolute top-4 right-4 p-2 rounded-full ${
              isFavorite ? "bg-red-500 text-white" : "bg-white text-black"
            }`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart size={20} fill={isFavorite ? "white" : "none"} />
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {carImages.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === activeImageIndex ? "bg-white" : "bg-gray-400"
              }`}
              onClick={() => setActiveImageIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">{carDetails.name}</h2>
          <div className="flex items-center gap-1">
            <span className="font-bold text-lg">{carDetails.rating}</span>
            <Image src="/images/star.png" alt="Rating" width={16} height={16} />
            <span className="text-gray-500 text-sm">
              ({carDetails.reviews} Reviews)
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{carDetails.description}</p>

        <div className="flex items-center gap-4 mb-6">
          <Image
            src={carDetails.owner.image || "/placeholder.svg"}
            alt={carDetails.owner.name}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-medium">{carDetails.owner.name}</h3>
              {carDetails.owner.verified && (
                <Image
                  src="/images/verified.png"
                  alt="Verified"
                  width={16}
                  height={16}
                />
              )}
            </div>
          </div>
          <div className="flex gap-2 ml-auto">
            <Link href="#" className="p-2 rounded-full border border-gray-300">
              <Phone size={20} />
            </Link>
            <Link href="#" className="p-2 rounded-full border border-gray-300">
              <MessageSquare size={20} />
            </Link>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-4">Car features</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {carDetails.features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Review (125)</h3>
          <Link href="/reviews" className="text-sm text-gray-500">
            See All
          </Link>
        </div>

        <div className="space-y-4 mb-8">
          {carDetails.reviewList.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Link
          href={`/booking/${params.id}`}
          className="btn-primary flex items-center justify-center gap-2"
        >
          Book Now
        </Link>
      </div>
    </main>
  );
}
