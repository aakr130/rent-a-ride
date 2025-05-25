"use client";

import { requireAuth } from "@/lib/auth";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type ProfileFormData = {
  name: string;
  email: string;
  image: FileList;
};

export default function EditProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProfileFormData>();

  const [previewUrl, setPreviewUrl] = useState("");

  const onSubmit = async (data: ProfileFormData) => {
    try {
      let imageUrl = "";

      // Step 1: Upload image to Vercel Blob
      const image = data.image?.[0];
      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const result = await res.json();
        imageUrl = result.url;
      }

      // Step 2: Save user info + image URL in DB
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          profile_image_url: imageUrl,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Profile updated");
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="max-w-xl px-4 py-10 mx-auto mt-24 bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-center">Edit Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          {...register("name")}
          className="w-full px-4 py-2 border border-gray-300 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full px-4 py-2 border border-gray-300 rounded"
        />

        <input
          type="file"
          accept="image/*"
          {...register("image")}
          className="block w-full px-3 py-2 border border-gray-300 rounded"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setPreviewUrl(URL.createObjectURL(file));
            }
          }}
        />

        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Preview"
            height={32}
            width={32}
            className="object-cover mx-auto mt-4 border rounded-full"
          />
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}
