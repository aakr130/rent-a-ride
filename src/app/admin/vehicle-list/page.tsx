"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

type Vehicle = {
  id: number;
  name: string;
  type: string;
  price: number;
  rating: number;
  seats: number;
  location: string;
};

export default function ManageVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    fetch("/api/vehicles/admin-vehicle")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setVehicles(data);
        } else {
          console.error("❌ Expected array but got:", data);
          toast.error("Unexpected response. Could not load vehicles.");
        }
      })
      .catch((err) => {
        console.error("❌ Error loading vehicles:", err);
        toast.error("Failed to fetch vehicle data.");
      });
  }, []);

  const handleDelete = async (id: number | null) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Vehicle deleted successfully");
        setVehicles((prev) => prev.filter((v) => v.id !== id));
      } else {
        toast.error("Failed to delete vehicle");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSelectedVehicleId(null);
    }
  };

  return (
    <main className="max-w-5xl p-6 mx-auto mt-20">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 border rounded hover:bg-gray-100"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Manage Vehicles</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="p-4 bg-white border rounded shadow">
            <h2 className="text-lg font-semibold">{vehicle.name}</h2>
            <p className="text-sm text-gray-600">
              {vehicle.type} • {vehicle.seats} seats • Rs.{vehicle.price}
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() =>
                  router.push(`/admin/vehicle-list/edit/${vehicle.id}`)
                }
                className="px-3 py-1 text-sm text-white bg-blue-500 rounded cursor-pointer hover:bg-blue-600"
              >
                Edit
              </button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="px-4 py-2 text-white bg-red-600 rounded cursor-pointer hover:bg-red-700"
                    onClick={() => setSelectedVehicleId(vehicle.id)}
                  >
                    Delete
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to permanently delete this vehicle?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 cursor-pointer hover:bg-red-700"
                      onClick={() => handleDelete(selectedVehicleId)}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
