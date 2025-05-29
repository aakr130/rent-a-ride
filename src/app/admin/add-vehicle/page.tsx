"use client";

import { useState } from "react";

export default function AddVehiclePage() {
  const [form, setForm] = useState({
    name: "",
    image: "",
    price: "",
    rating: "",
    seats: "",
    location: "",
    description: "",
    type: "car",
    tags: [] as string[],
  });

  const [message, setMessage] = useState("");

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
      setMessage("✅ Vehicle added successfully!");
      setForm({
        name: "",
        image: "",
        price: "",
        rating: "",
        seats: "",
        location: "",
        description: "",
        type: "car",
        tags: [],
      });
    } else {
      setMessage(`❌ ${data.error || "Failed to add vehicle."}`);
    }
  };

  return (
    <main className="max-w-5xl p-6 mx-auto mt-12 bg-white rounded shadow-md">
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
        <input
          name="image"
          placeholder="Image URL"
          className="input"
          value={form.image}
          onChange={handleChange}
          required
        />
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

      {message && <p className="mt-4 text-sm text-center">{message}</p>}
    </main>
  );
}
