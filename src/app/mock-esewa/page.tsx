"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function MockEsewaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pid = searchParams?.get("pid") ?? "";
  const amt = searchParams?.get("amt") ?? "0";
  const su = searchParams?.get("su") ?? "/";
  const fu = searchParams?.get("fu") ?? "/";

  const [esewaId, setEsewaId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const vehicle_id_raw = searchParams?.get("vehicle_id");
      const start_date_raw = searchParams?.get("start_date");
      const end_date_raw = searchParams?.get("end_date");
      const duration_value_raw = searchParams?.get("duration_value");

      if (
        !vehicle_id_raw ||
        !start_date_raw ||
        !end_date_raw ||
        !duration_value_raw ||
        !esewaId
      ) {
        console.error("❌ Missing essential booking fields");
        router.push(`${fu}?status=fail&pid=${pid}`);
        return;
      }

      const payload = {
        pid,
        amt: Number(amt),
        esewa_id: esewaId,
        vehicle_id: Number(vehicle_id_raw),
        start_date: decodeURIComponent(start_date_raw),
        end_date: decodeURIComponent(end_date_raw),
        duration_value: Number(duration_value_raw),
      };

      const res = await fetch("/api/mock-esewa/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      const successUrl = su.includes("?")
        ? `${su}&status=success&pid=${pid}`
        : `${su}?status=success&pid=${pid}`;

      const failUrl = fu.includes("?")
        ? `${fu}&status=fail&pid=${pid}`
        : `${fu}?status=fail&pid=${pid}`;

      if (res.ok) {
        router.push(successUrl);
      } else {
        router.push(failUrl);
      }
    } catch (err) {
      const errorUrl = fu.includes("?")
        ? `${fu}&status=error&pid=${pid}`
        : `${fu}?status=error&pid=${pid}`;

      router.push(errorUrl);
    }
  };

  return (
    <main className="min-h-screen bg-[#f2fef7] flex items-center justify-center p-4">
      <div className="w-full max-w-sm overflow-hidden bg-white rounded-lg shadow-md">
        <div className="relative p-6 bg-white rounded-t-lg">
          <img
            src="/svg/esewa.png"
            alt="eSewa Logo"
            className="w-32 mx-auto mb-4"
          />
          <svg
            className="absolute bottom-0 left-0 w-full h-6 text-white"
            viewBox="0 0 1440 320"
          >
            <path
              fill="white"
              d="M0,192L80,186.7C160,181,320,171,480,170.7C640,171,800,181,960,186.7C1120,192,1280,192,1360,192L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              eSewa ID
            </label>
            <input
              type="text"
              required
              value={esewaId}
              onChange={(e) => setEsewaId(e.target.value)}
              placeholder="98XXXXXXXX"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              type="text"
              readOnly
              value={amt}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-green-600 rounded hover:bg-green-700"
          >
            Pay Now
          </button>
        </form>
      </div>
    </main>
  );
}
