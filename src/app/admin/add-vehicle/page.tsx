"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AddVehiclePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    images: [""],
    price: "",
    rating: "",
    seats: "",
    location: "",
    description: "",
    type: "car",
    brand: "",
    tags: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "tags") {
      const tag = value;
      setForm((prev) => ({
        ...prev,
        tags: prev.tags.includes(tag)
          ? prev.tags.filter((t) => t !== tag)
          : [...prev.tags, tag],
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const updatedImages = [...form.images];
    updatedImages[index] = value;
    setForm({ ...form, images: updatedImages });
  };

  const addImageField = () => {
    setForm({ ...form, images: [...form.images, ""] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/vehicles/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        price: +form.price,
        rating: +form.rating,
        seats: +form.seats,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("✅ Vehicle added successfully!");
      setForm({
        name: "",
        images: [""],
        price: "",
        rating: "",
        seats: "",
        location: "",
        description: "",
        type: "car",
        brand: "",
        tags: [],
      });
    } else {
      toast.error(data.error || "❌ Failed to add vehicle.");
    }
  };

  return (
    <main className="max-w-5xl p-6 mx-auto mt-12 bg-white rounded shadow-md">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <h1 className="mb-6 text-3xl font-bold text-gray-800">Add New Vehicle</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <input
          name="name"
          placeholder="Name"
          className="input"
          value={form.name}
          onChange={handleChange}
          required
        />
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-600">
            Image URLs
          </label>
          {form.images.map((img, idx) => (
            <input
              key={idx}
              type="text"
              value={img}
              onChange={(e) => handleImageChange(idx, e.target.value)}
              placeholder={`Image URL ${idx + 1}`}
              className="input"
              required={idx === 0}
            />
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add another image
          </button>
        </div>
        <input
          name="price"
          placeholder="Price"
          type="number"
          className="input"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          name="rating"
          placeholder="Rating"
          type="number"
          step="0.1"
          className="input"
          value={form.rating}
          onChange={handleChange}
          required
        />
        <input
          name="seats"
          placeholder="Seats"
          type="number"
          className="input"
          value={form.seats}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          className="input"
          value={form.location}
          onChange={handleChange}
          required
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="input"
        >
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="scooter">Scooter</option>
        </select>

        <input
          name="brand"
          placeholder="Enter Brand (e.g., Tesla)"
          value={form.brand}
          onChange={handleChange}
          className="input"
          required
        />

        {/* Tags checkbox layout */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Tags</label>
          {["just-added", "top", "electric"].map((tag) => (
            <label
              key={tag}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <input
                type="checkbox"
                name="tags"
                value={tag}
                checked={form.tags.includes(tag)}
                onChange={handleChange}
              />
              {tag === "just-added"
                ? "Just Added"
                : tag === "top"
                ? "Top Picks"
                : "Electric"}
            </label>
          ))}
        </div>

        <textarea
          name="description"
          placeholder="Description"
          className="input md:col-span-2"
          value={form.description}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 md:col-span-2"
        >
          Add Vehicle
        </button>
      </form>
    </main>
  );
}
