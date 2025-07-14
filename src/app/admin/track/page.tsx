"use client";

import { useEffect, useState, useRef } from "react";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const MapClient = dynamic(() => import("../../../../components/MapClient"), {
  ssr: false,
});

type Booking = {
  id: number;
  vehicle_id: number;
  vehicle_name: string;
  vehicle_type: string;
  image_url: string;
  status: string;
};

const VEHICLE_LOCATIONS: Record<number, [number, number]> = {
  1: [27.7172, 85.324], // Kathmandu
  2: [28.2096, 83.9856], // Pokhara
  3: [26.8093, 87.2841], // Biratnagar
  4: [27.6378, 84.4312], // Bharatpur
  5: [27.6906, 85.35], // Bhaktapur
  6: [27.6, 85.3], // Patan
  7: [27.4, 85.05], // Dhulikhel
  8: [27.9, 84.1], // Gorkha
};

function getDeterministicOffset(
  base: [number, number],
  id: number
): [number, number] {
  const latOffset = ((id % 10) - 5) * 0.01;
  const lonOffset = ((Math.floor(id / 10) % 10) - 5) * 0.01;
  return [base[0] + latOffset, base[1] + lonOffset];
}

function getVehicleStartLocation(vehicleId: number): [number, number] {
  return (
    VEHICLE_LOCATIONS[vehicleId] ||
    getDeterministicOffset([27.7172, 85.324], vehicleId)
  );
}

export default function TrackVehiclePage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [trackingBooking, setTrackingBooking] = useState<Booking | null>(null);

  const [vehicleCoords, setVehicleCoords] = useState<[number, number] | null>(
    null
  );
  const [pathCoords, setPathCoords] = useState<[number, number][]>([]);

  const headingRef = useRef<number>(90);

  useEffect(() => {
    fetch("/api/admins/bookings", {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Booking[]) => {
        setBookings(data.filter((b) => b.status === "Confirmed"));
      })
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!trackingBooking) return;
    let cancelled = false;

    const base = getVehicleStartLocation(trackingBooking.vehicle_id);

    setVehicleCoords(base);
    setPathCoords([base]);
    headingRef.current = 90;

    const interval = setInterval(() => {
      if (cancelled) return;

      headingRef.current += (Math.random() - 0.5) * 2;

      setVehicleCoords((coords) => {
        if (!coords) return coords;
        const [lat, lon] = coords;

        const speed = 0.0005;
        const rad = (headingRef.current * Math.PI) / 180;
        const deltaLat = Math.cos(rad) * speed;
        const deltaLon = Math.sin(rad) * speed;

        const newCoords: [number, number] = [lat + deltaLat, lon + deltaLon];
        setPathCoords((prev) => [...prev, newCoords]);

        return newCoords;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [trackingBooking]);

  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <h1 className="mb-6 text-2xl font-bold">Track Booked Vehicles</h1>

      {loading ? (
        <Skeleton className="w-full h-32" />
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">No confirmed bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-4 space-y-3">
                <Image
                  src={booking.image_url}
                  alt={booking.vehicle_name}
                  width={400}
                  height={200}
                  className="object-cover w-full h-40 rounded"
                />
                <div>
                  <p className="text-lg font-semibold">
                    {booking.vehicle_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.vehicle_type}
                  </p>
                </div>
                <Button
                  className="cursor-pointer"
                  onClick={() => {
                    setTrackingBooking(null);
                    setVehicleCoords(null);
                    setPathCoords([]);
                    setTimeout(() => {
                      setTrackingBooking(booking);
                    }, 0);
                  }}
                >
                  Track Vehicle
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {vehicleCoords && trackingBooking && (
        <div className="p-4 mt-10 bg-gray-100 border rounded-lg">
          <h2 className="mb-2 text-xl font-semibold">
            Tracking: {trackingBooking.vehicle_name} (
            {trackingBooking.vehicle_type})
          </h2>

          <MapClient
            key={trackingBooking.vehicle_id}
            vehicleCoords={vehicleCoords}
            pathCoords={pathCoords}
            vehicleId={trackingBooking.vehicle_id}
          />
        </div>
      )}
    </div>
  );
}
