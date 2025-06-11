"use client";

import { useEffect, useState } from "react";
import Spinner from "@/app/icons/spinner";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type AdminBooking = {
  id: number;
  vehicle_name: string;
  vehicle_type: string;
  start_date: string;
  end_date: string;
  estimated_price: number;
  payment_method: string;
  status: string;
  user_name: string;
  user_email: string;
  image_url?: string;
};

export default function AdminBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admins/bookings")
      .then((res) => res.json())
      .then(setBookings)
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: "Confirmed" | "Rejected") => {
    const res = await fetch(`/api/admins/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }), // 👈 simplified, no need to send booking_id separately
    });

    if (!res.ok) return toast.error("Failed to update status");

    const updated = await res.json();
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: updated.status } : b))
    );
    toast.success(`Booking ${status.toLowerCase()}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="w-8 h-8 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl p-6 mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600"
        >
          <ArrowLeft size={18} />
        </button>
      </div>
      <h1 className="mb-6 text-2xl font-bold">Manage Bookings</h1>

      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col p-4 mb-4 border rounded-lg shadow-sm bg-white/80 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-start gap-4">
              {booking.image_url && (
                <img
                  src={booking.image_url}
                  alt={booking.vehicle_name}
                  className="object-cover w-20 h-20 rounded-lg"
                />
              )}

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {booking.vehicle_name} ({booking.vehicle_type})
                </h2>
                <p className="text-sm text-gray-600">
                  {new Date(booking.start_date).toLocaleDateString()} →{" "}
                  {new Date(booking.end_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  Rs. {booking.estimated_price} – {booking.payment_method}
                </p>
                <p className="text-sm text-gray-600">
                  User: {booking.user_name} ({booking.user_email})
                </p>
                <p className="mt-1 text-sm font-medium text-gray-700">
                  Status:{" "}
                  <span
                    className={`font-semibold px-2 py-1 rounded-full ${
                      booking.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {booking.status || "Pending"}
                  </span>
                </p>
              </div>
            </div>

            {booking.status === "Pending" && (
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => updateStatus(booking.id, "Confirmed")}
                  className="px-4 py-1 text-sm font-medium text-white bg-green-600 rounded cursor-pointer hover:bg-green-700"
                >
                  Confirm
                </button>
                <button
                  onClick={() => updateStatus(booking.id, "Rejected")}
                  className="px-4 py-1 text-sm font-medium text-white bg-red-600 rounded cursor-pointer hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-600">No bookings available.</p>
      )}
    </div>
  );
}
