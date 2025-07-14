"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ConfirmInner() {
  const searchParams = useSearchParams();
  const status = searchParams?.get("status") ?? "";

  const isSuccess = status === "success";
  const isFail = status === "fail";

  const title = isSuccess
    ? "✅ Booking Confirmed!"
    : isFail
    ? "❌ Payment Failed"
    : "⚠️ Something Went Wrong";

  const message = isSuccess
    ? "Your booking has been successfully processed."
    : isFail
    ? "There was an issue processing your payment. Please try again."
    : "We couldn’t complete your booking due to an unexpected error.";

  const bgColor = isSuccess
    ? "bg-green-50 text-green-800"
    : isFail
    ? "bg-yellow-50 text-yellow-800"
    : "bg-red-50 text-red-800";

  const linkHref = isSuccess ? "/my-booking" : isFail ? "/" : "/dashboard";

  const linkLabel = isSuccess
    ? "View my bookings"
    : isFail
    ? "Retry Booking"
    : "Back to Dashboard";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className={`max-w-lg w-full p-8 rounded-lg shadow ${bgColor}`}>
        <h1 className="mb-4 text-2xl font-bold">{title}</h1>
        <p className="mb-6">{message}</p>
        <Link
          href={linkHref}
          className="px-6 py-3 font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {linkLabel}
        </Link>
      </div>
    </main>
  );
}
