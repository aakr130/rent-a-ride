"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";

export default function AddVehiclePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    images: [{ file: null as File | null, preview: "", url: "" }],
    price: "",
    rating: "",
    seats: "",
    location: "",
    description: "",
    type: "car",
    brand: "",
    tags: [] as string[],
    color: "",
    fuel_type: "",
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
  const removeImage = (index: number) => {
    const updatedImages = [...form.images];
    updatedImages[index] = { file: null, url: "", preview: "" };
    setForm({ ...form, images: updatedImages });
  };
  const handleImageFileChange = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const updatedImages = [...form.images];
      updatedImages[index] = {
        file,
        url: "",
        preview: base64String,
      };
      setForm({ ...form, images: updatedImages });
    };
    reader.readAsDataURL(file);
  };

  const handleImageURLChange = (index: number, value: string) => {
    const updatedImages = [...form.images];
    updatedImages[index] = {
      file: null,
      url: value,
      preview: value,
    };
    setForm({ ...form, images: updatedImages });
  };

  const addImageField = () => {
    setForm({
      ...form,
      images: [...form.images, { file: null, preview: "", url: "" }],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const imagePayload = form.images.map((img) => img.preview); // base64 strings or URLs

    const res = await fetch("/api/vehicles/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        images: imagePayload,
        price: +form.price,
        rating: +form.rating,
        seats: +form.seats,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Vehicle added successfully!");
      setForm({
        name: "",
        images: [{ file: null, preview: "", url: "" }],
        price: "",
        rating: "",
        seats: "",
        location: "",
        description: "",
        type: "car",
        brand: "",
        tags: [],
        color: "",
        fuel_type: "",
      });
    } else {
      toast.error(data.error || "Failed to add vehicle.");
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

        <div className="flex flex-col gap-4 md:col-span-2">
          <label className="text-sm font-medium text-gray-600 cursor-pointer">
            Upload Images
          </label>

          {form.images.map((img, idx) => (
            <div
              key={idx}
              className="relative flex flex-col gap-3 p-4 border rounded-md bg-gray-50"
            >
              {!img.preview && (
                <>
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor={`file-upload-${idx}`}
                      className="px-4 py-2 text-sm font-medium text-white transition bg-blue-600 rounded cursor-pointer hover:bg-blue-700"
                    >
                      Choose Image {idx + 1}
                    </label>
                    <input
                      id={`file-upload-${idx}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files &&
                        handleImageFileChange(idx, e.target.files[0])
                      }
                      required={idx === 0}
                    />
                  </div>

                  <input
                    type="text"
                    value={img.url}
                    onChange={(e) => handleImageURLChange(idx, e.target.value)}
                    placeholder={`Paste Image URL ${idx + 1}`}
                    className="text-sm input"
                  />
                </>
              )}

              {/* Image preview with removable cross */}
              {img.preview && (
                <div className="relative mt-2 w-fit">
                  <img
                    src={img.preview}
                    alt={`Preview ${idx + 1}`}
                    className="object-cover w-auto h-24 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
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
            onClick={addImageField}
            className="text-sm text-blue-600 cursor-pointer hover:underline"
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
        <input
          name="color"
          placeholder="Color (e.g., Red)"
          className="input"
          value={form.color}
          onChange={handleChange}
          required
        />
        <input
          name="fuel_type"
          placeholder="Fuel Type (e.g., Petrol)"
          className="input"
          value={form.fuel_type}
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
          className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded cursor-pointer curosor-pointer hover:bg-blue-700 md:col-span-2"
        >
          Add Vehicle
        </button>
      </form>
    </main>
  );
}
