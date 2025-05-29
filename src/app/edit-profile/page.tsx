"use client";

import { QueryClient, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import Spinner from "../icons/spinner";
import { ArrowLeft } from "lucide-react";

type ProfileFormData = {
  name: string;
  email: string;
  image: FileList;
  password?: string;
};

export default function EditProfilePage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormData>();

  const [previewUrl, setPreviewUrl] = useState("");
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.authenticated && data.user) {
          setValue("name", data.user.name);
          setValue("email", data.user.email);
          if (data.user.profile_image_url) {
            setPreviewUrl(data.user.profile_image_url);
            setOriginalImageUrl(data.user.profile_image_url);
          }
        }
        setUserLoaded(true);
      } catch (err) {
        console.error("Error fetching user:", err);
        toast.error("Failed to load user data");
      }
    }

    fetchUser();
  }, [setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      let imageUrl = originalImageUrl || "";

      const image = data.image?.[0];
      if (image) {
        const formData = new FormData();
        formData.append("file", image);

        const uploadRes = await fetch("/api/upload-file", {
          method: "POST",
          body: formData,
        });

        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok || !uploadResult?.url) {
          throw new Error(uploadResult?.error || "Image upload failed");
        }

        imageUrl = uploadResult.url;
      }

      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          profile_image_url: imageUrl,
          ...(data.password ? { password: data.password } : {}),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully");
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        throw new Error(result.message || "Update failed");
      }
    } catch (err: any) {
      console.error("🔥 Profile update error:", err);
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : JSON.stringify(err);

      toast.error(message || "Something went wrong");
    }
  };

  return (
    <main className="relative max-w-xl px-6 py-10 mx-auto mt-20 bg-white shadow-lg rounded-2xl">
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="absolute p-2 transition rounded-full top-4 left-4 hover:bg-gray-100"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>

      <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">
        Edit Profile
      </h1>

      {!userLoaded ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow ring-2 ring-gray-300">
            <div className="transition-opacity duration-300 animate-fade-in">
              <Spinner className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            {previewUrl && (
              <Image
                src={previewUrl}
                alt="Avatar"
                width={96}
                height={96}
                className="object-cover border rounded-full"
              />
            )}

            <Controller
              name="image"
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPreviewUrl(URL.createObjectURL(file));
                      field.onChange(e.target.files);
                    }
                  }}
                />
              )}
            />

            <button
              type="button"
              onClick={() =>
                (
                  document.querySelector(
                    'input[type="file"]'
                  ) as HTMLInputElement
                )?.click()
              }
              className="px-4 py-1.5 text-sm font-medium text-white bg-gray-700 rounded hover:bg-gray-800"
            >
              Upload New Picture
            </button>
          </div>

          <input
            type="text"
            placeholder="Full Name"
            {...register("name")}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="New Password (leave blank to keep current)"
            {...register("password", {
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      )}
    </main>
  );
}
