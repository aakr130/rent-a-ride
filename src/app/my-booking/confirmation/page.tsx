// app/booking/confirmation/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function BookingConfirmation() {
  const search = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setStatus(search ? search.get("status") : null);
  }, [search]);

  let title: string;
  let message: string;
  let bgColor: string;
  let linkLabel: string;

  switch (status) {
    case "success":
      title = "✅ Booking Confirmed!";
      message = "Your booking has been successfully processed.";
      bgColor = "bg-green-50 text-green-800";
      linkLabel = "View my bookings";
      break;
    case "fail":
      title = "❌ Payment Failed";
      message = "There was an issue processing your payment. Please try again.";
      bgColor = "bg-yellow-50 text-yellow-800";
      linkLabel = "Retry Booking";
      break;
    case "error":
    default:
      title = "⚠️ Something Went Wrong";
      message = "We couldn’t complete your booking due to an unexpected error.";
      bgColor = "bg-red-50 text-red-800";
      linkLabel = "Back to Dashboard";
      break;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className={`max-w-lg w-full p-8 rounded-lg shadow ${bgColor}`}>
        <h1 className="mb-4 text-2xl font-bold">{title}</h1>
        <p className="mb-6">{message}</p>
        <div className="flex justify-center">
          <Link
            href={
              status === "success"
                ? "/my-booking"
                : status === "fail"
                ? "/"
                : "/dashboard"
            }
            className="px-6 py-3 font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {linkLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
