"use client";

import { useEffect, useState } from "react";
import Spinner from "@/app/icons/spinner";
import toast from "react-hot-toast";
import Link from "next/link";

const getRouteSegment = (type: string) => {
  const t = type?.toLowerCase();
  if (t.includes("car")) return "cars";
  if (t.includes("bike")) return "bikes";
  if (t.includes("scooter")) return "scooters";
  return "cars"; // fallback
};

type Booking = {
  id: number;
  vehicle_id: string;
  vehicle_type: "cars" | "bikes" | "scooter";
  vehicle_name: string;
  image_url?: string;
  start_date: string;
  end_date: string;
  duration_value: number;
  estimated_price: number;
  payment_method: string;
  status: string;
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data);
      } catch (err: any) {
        toast.error(err.message || "Error loading bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="max-w-4xl px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">My Bookings</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="w-8 h-8 text-gray-500" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-gray-600">You have no bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col p-4 border rounded-lg shadow-sm bg-white/80 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-start gap-4">
                {booking.image_url && (
                  <Link
                    href={`/dashboard/${getRouteSegment(
                      booking.vehicle_type
                    )}/${booking.vehicle_id}`}
                  >
                    <img
                      src={booking.image_url}
                      alt={booking.vehicle_name}
                      className="object-cover w-20 h-20 rounded-lg cursor-pointer hover:opacity-90"
                    />
                  </Link>
                )}

                <div>
                  <Link
                    href={`/dashboard/${getRouteSegment(
                      booking.vehicle_type
                    )}/${booking.vehicle_id}`}
                  >
                    {booking.vehicle_name}
                  </Link>

                  <p className="text-sm text-gray-600">
                    {new Date(booking.start_date).toLocaleDateString()} →{" "}
                    {new Date(booking.end_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration: {booking.duration_value} day
                    {booking.duration_value > 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-gray-600">
                    Payment: {booking.payment_method}
                  </p>
                </div>
              </div>

              <div className="mt-4 text-right md:mt-0">
                <p className="text-lg font-semibold text-green-700">
                  Rs. {booking.estimated_price}
                </p>
                <span
                  className={`inline-block px-2 py-1 mt-1 text-xs font-medium rounded-full ${
                    (booking.status || "Pending") === "Confirmed"
                      ? "bg-green-100 text-green-700"
                      : (booking.status || "Pending") === "Completed"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-yellow-700"
                  }`}
                >
                  {booking.status || "Pending"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
