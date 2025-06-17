"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookNowDialog({ vehicle }: { vehicle: any }) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [durationValue, setDurationValue] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const [licenseStatus, setLicenseStatus] = useState<
    "pending" | "approved" | "rejected" | null
  >(null);
  const isVerified = licenseStatus === "approved";

  // Fetch user's license status
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setLicenseStatus(data?.user?.license_status ?? null);
      } catch (err) {
        console.error("Failed to fetch license status", err);
        toast.error("Couldn't verify license");
      }
    }

    fetchUser();
  }, []);

  // Auto-calculate duration + price
  useEffect(() => {
    if (!startDate || !endDate || !vehicle?.price) {
      setDurationValue(null);
      setEstimatedPrice(0);
      return;
    }

    if (endDate < startDate) {
      setDurationValue(null);
      setEstimatedPrice(0);
      return;
    }

    const diffInMs = endDate.getTime() - startDate.getTime();
    const days = Math.max(Math.ceil(diffInMs / (1000 * 60 * 60 * 24)), 1);
    setDurationValue(days);
    setEstimatedPrice(Number((vehicle.price * days).toFixed(2)));
  }, [startDate, endDate, vehicle]);

  const handleBooking = async () => {
    if (!startDate || !endDate || !durationValue) {
      toast.error("Please select valid dates.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          vehicle_id: vehicle.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          duration_value: durationValue,
          payment_method: paymentMethod,
          estimated_price: estimatedPrice,
        }),
      });

      if (res.ok) {
        toast.success("Booking confirmed!");
        setStartDate(null);
        setEndDate(null);
      } else {
        const error = await res.json();
        toast.error(error?.error || "Booking failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        disabled={!isVerified}
        className={`w-full py-2 mt-4 font-semibold text-white transition rounded ${
          isVerified
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isVerified ? "Book Now" : "Upload & Verify License to Book"}
      </DialogTrigger>

      <DialogContent className="p-6 space-y-4 sm:p-8">
        <DialogTitle className="mb-2 text-2xl font-semibold text-gray-800">
          Book <span className="text-blue-600">{vehicle.name}</span>
        </DialogTitle>

        {!isVerified && (
          <div className="px-3 py-2 text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded">
            You must upload and verify your license before booking.
          </div>
        )}

        {/* Form only shown if verified */}
        {isVerified && (
          <>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <DatePicker
                selected={startDate ?? undefined}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate ?? undefined}
                endDate={endDate ?? undefined}
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholderText="Select start date"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <DatePicker
                selected={endDate ?? undefined}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate ?? undefined}
                endDate={endDate ?? undefined}
                minDate={startDate ?? new Date()}
                dateFormat="yyyy-MM-dd"
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholderText="Select end date"
              />
            </div>

            {durationValue !== null && (
              <div className="text-sm text-gray-700">
                Duration: <strong>{durationValue}</strong> day
                {durationValue > 1 ? "s" : ""}
              </div>
            )}

            {estimatedPrice > 0 && (
              <div className="text-sm text-gray-700">
                Estimated Price:{" "}
                <strong className="text-green-600">Rs. {estimatedPrice}</strong>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cash">Cash on Delivery</option>
                <option value="esewa">eSewa</option>
              </select>
            </div>

            {paymentMethod === "esewa" ? (
              isVerified ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!startDate || !endDate || !durationValue) {
                      toast.error(
                        "Please select valid dates before proceeding."
                      );
                      return;
                    }

                    const pid = `booking_${vehicle.id}_${Date.now()}`;
                    const successUrl = `${window.location.origin}/my-booking/confirmation?status=success`;
                    const failUrl = `${window.location.origin}/my-booking/confirmation?status=fail`;
                    const esewaUrl = `/mock-esewa?pid=${pid}&amt=${estimatedPrice}&vehicle_id=${
                      vehicle.id
                    }&start_date=${encodeURIComponent(
                      startDate.toISOString()
                    )}&end_date=${encodeURIComponent(
                      endDate.toISOString()
                    )}&duration_value=${durationValue}&su=${encodeURIComponent(
                      successUrl
                    )}&fu=${encodeURIComponent(failUrl)}`;

                    window.location.href = esewaUrl;
                  }}
                  className="w-full py-2 text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Pay with eSewa
                </button>
              ) : (
                <div className="px-3 py-2 text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 rounded">
                  You must upload and verify your license before paying with
                  eSewa.
                </div>
              )
            ) : (
              <button
                onClick={handleBooking}
                disabled={loading || !startDate || !endDate}
                className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
