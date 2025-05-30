"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function EditVehiclePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`/api/vehicles/${id}`);
        const data = await res.json();

        if (res.ok) {
          setVehicle(data);
        } else {
          toast.error(data.error || "Vehicle not found.");
        }
      } catch {
        toast.error("Failed to fetch vehicle data.");
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setVehicle({ ...vehicle, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicle),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Vehicle updated!");
        router.push("/admin/vehicle-list");
      } else {
        toast.error(data.error || "Failed to update vehicle.");
      }
    } catch (err) {
      toast.error("Unexpected error. Please try again.");
    }
  };

  if (loading)
    return <p className="p-4 text-center text-gray-600">Loading...</p>;

  return (
    <main className="max-w-3xl px-4 mx-auto mt-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Edit Vehicle</h1>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 border rounded hover:bg-gray-100"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Vehicle Name
          </label>
          <input
            name="name"
            value={vehicle.name}
            onChange={handleChange}
            className="input"
            placeholder="Name"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            name="location"
            value={vehicle.location}
            onChange={handleChange}
            className="input"
            placeholder="Location"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Price (Rs.)
          </label>
          <input
            name="price"
            type="number"
            value={vehicle.price}
            onChange={handleChange}
            className="input"
            placeholder="Price"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Rating
          </label>
          <input
            name="rating"
            type="number"
            step="0.1"
            value={vehicle.rating}
            onChange={handleChange}
            className="input"
            placeholder="Rating"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={vehicle.description}
            onChange={handleChange}
            className="input"
            placeholder="Description"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
