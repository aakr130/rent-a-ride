"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.role !== "admin") {
      router.replace("/login"); // Redirect non-admins
    }
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user");
    router.push("/login");
  };

  const actions = [
    {
      label: "➕ Add Vehicle",
      description: "Add new car, bike, or scooter to the fleet",
      href: "/admin/add-vehicle",
    },
    {
      label: "🚗 Manage Vehicles",
      description: "Edit or delete existing listings",
      href: "/admin/vehicle-list",
    },
    {
      label: "👥 Manage Users",
      description: "View and manage registered users",
      href: "/admin/users",
    },

    {
      label: "👥 Manage Admins",
      description: "Add and manage admins ",
      href: "/admin/admins-list",
    },
    {
      label: "📊 Manage booking",
      description: "View and manage bookings",
      href: "/admin/booking",
    },

    {
      label: "📊 Verify License ",
      description: "View and verify License",
      href: "/admin/verify-license",
    },

    {
      label: "📊 Incoming Payments",
      description:
        "View all and verify payements and accodingly change the user's booking status",
      href: "/admin/payments",
    },
  ];

  return (
    <main className="min-h-screen px-6 py-10 mt-20 text-gray-800 bg-gradient-to-b from-white via-slate-100 to-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white transition bg-red-500 rounded cursor-pointer hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => router.push(action.href)}
              className="p-6 text-left transition bg-white border border-gray-200 shadow cursor-pointer hover:shadow-lg rounded-xl hover:bg-gray-50"
            >
              <h2 className="mb-1 text-lg font-semibold">{action.label}</h2>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
