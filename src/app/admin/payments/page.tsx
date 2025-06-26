"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admins/payments")
      .then((res) => res.json())
      .then((rows) => setData(rows))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <h1 className="mb-4 text-2xl font-bold">Incoming Payments</h1>

      {loading ? (
        <p>Loading payments...</p>
      ) : (
        <table className="min-w-full text-sm bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">User</th>
              <th className="p-2">Vehicle</th>
              <th className="p-2">Method</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Start</th>
              <th className="p-2">End</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p: any) => (
              <tr key={p.booking_id} className="border-t">
                <td className="p-2">{p.user_name}</td>
                <td className="p-2">{p.vehicle_name}</td>
                <td className="p-2 capitalize">{p.payment_method}</td>
                <td className="p-2 text-green-700">Rs. {p.estimated_price}</td>
                <td className="p-2">{p.start_date}</td>
                <td className="p-2">{p.end_date}</td>
                <td className="p-2">
                  {new Date(p.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
