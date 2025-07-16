"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, X } from "lucide-react";

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
            Seat
          </label>
          <input
            name="seats"
            type="number"
            value={vehicle.seats}
            onChange={handleChange}
            className="input"
            placeholder="Seat"
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

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Images
          </label>

          <div className="flex flex-col gap-4">
            {vehicle.images?.map((img: string, idx: number) => (
              <div
                key={idx}
                className="relative flex flex-col gap-3 p-4 border rounded-md bg-gray-50"
              >
                {!img.startsWith("data:") && !img.startsWith("http") && (
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor={`edit-file-upload-${idx}`}
                      className="px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded cursor-pointer hover:bg-blue-700"
                    >
                      Choose Image {idx + 1}
                    </label>
                    <input
                      id={`edit-file-upload-${idx}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const updated = [...vehicle.images];
                            updated[idx] = reader.result as string;
                            setVehicle({ ...vehicle, images: updated });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                )}

                {!img.startsWith("data:") && (
                  <input
                    type="text"
                    value={img}
                    onChange={(e) => {
                      const updated = [...vehicle.images];
                      updated[idx] = e.target.value;
                      setVehicle({ ...vehicle, images: updated });
                    }}
                    placeholder={`Paste Image URL ${idx + 1}`}
                    className="text-sm input"
                  />
                )}

                {img && (
                  <div className="relative mt-2 w-fit">
                    <img
                      src={img}
                      alt={`Preview ${idx + 1}`}
                      className="object-cover w-auto h-24 border rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...vehicle.images];
                        updated[idx] = "";
                        setVehicle({ ...vehicle, images: updated });
                      }}
                      className="absolute p-1 transition bg-white border border-gray-300 rounded-full -top-2 -right-2 hover:bg-red-100"
                      aria-label="Remove image"
                    >
                      <X size={16} className="text-red-500" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setVehicle({
                  ...vehicle,
                  images: [...(vehicle.images || []), ""],
                })
              }
              className="text-sm text-blue-600 hover:underline"
            >
              + Add another image
            </button>
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 ">
            Vehicle Type
          </label>
          <select
            name="type"
            value={vehicle.type}
            onChange={handleChange}
            className="cursor-pointer input"
          >
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="scooter">Scooter</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Tags
          </label>
          {["just-added", "top", "electric"].map((tag) => (
            <label key={tag} className="block text-sm">
              <input
                type="checkbox"
                name="tags"
                value={tag}
                checked={vehicle.tags?.includes(tag)}
                onChange={() => {
                  const nextTags = vehicle.tags || [];
                  const updated = nextTags.includes(tag)
                    ? nextTags.filter((t: any) => t !== tag)
                    : [...nextTags, tag];
                  setVehicle({ ...vehicle, tags: updated });
                }}
              />
              <span className="ml-2 cursor-pointer">{tag}</span>
            </label>
          ))}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            name="color"
            value={vehicle.color}
            onChange={handleChange}
            className="input"
            placeholder="Color"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Fuel Type
          </label>
          <input
            name="fuel_type"
            value={vehicle.fuel_type}
            onChange={handleChange}
            className="input"
            placeholder="Fuel Type"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 mb-6 font-semibold text-white bg-blue-600 rounded cursor-pointer hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
