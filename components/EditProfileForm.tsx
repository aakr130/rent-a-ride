"use client";

import Spinner from "@/app/icons/spinner";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

type ProfileFormData = {
  name: string;
  email: string;
  image: FileList;
  password?: string;
  phone_number?: string;
  address?: string;
  license_card?: FileList;
};

export default function EditProfileForm({ onDone }: { onDone: () => void }) {
  const [licenseCardPreview, setLicenseCardPreview] = useState("");
  const [licenseStatus, setLicenseStatus] = useState("");

  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormData>();

  const [previewUrl, setPreviewUrl] = useState("");
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [userLoaded, setUserLoaded] = useState(false);

  const watchFields = watch(["phone_number", "address", "license_card"]);
  const isComplete =
    !!watchFields[0]?.trim() &&
    !!watchFields[1]?.trim() &&
    (watchFields[2]?.length ?? 0) > 0;

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
          if (data.user.phone_number) {
            setValue("phone_number", data.user.phone_number);
          }
          if (data.user.address) {
            setValue("address", data.user.address);
          }
          if (data.user.license_card_url) {
            setLicenseCardPreview(data.user.license_card_url);
          }

          if (data.user.license_status) {
            setLicenseStatus(data.user.license_status);
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
      let licenseCardUrl = "";

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

      const licenseCard = data.license_card?.[0];
      if (licenseCard) {
        const licenseForm = new FormData();
        licenseForm.append("file", licenseCard);

        const licenseRes = await fetch("/api/upload-file", {
          method: "POST",
          body: licenseForm,
        });

        const licenseResult = await licenseRes.json();
        if (!licenseRes.ok || !licenseResult?.url) {
          throw new Error(licenseResult?.error || "License upload failed");
        }

        licenseCardUrl = licenseResult.url;
      }

      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          profile_image_url: imageUrl,
          phone_number: data.phone_number?.trim() || null,
          address: data.address?.trim() || null,
          license_card_url: licenseCardUrl || null,
          ...(data.password ? { password: data.password } : {}),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully");
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        onDone?.(); 
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

  if (!userLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow ring-2 ring-gray-300">
          <Spinner className="w-8 h-8 text-gray-600" />
        </div>
      </div>
    );
  }

  return (
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
              document.querySelector('input[type="file"]') as HTMLInputElement
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
        disabled
      />

      <input
        type="email"
        placeholder="Email"
        {...register("email")}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
        disabled
      />

      <input
        type="text"
        placeholder="Phone Number"
        {...register("phone_number")}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <textarea
        placeholder="Address"
        rows={3}
        {...register("address")}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />

      <div className="flex flex-col gap-2">
        <label className="font-medium text-gray-700">Upload License Card</label>
        <Controller
          name="license_card"
          control={control}
          defaultValue={undefined}
          render={({ field }) => (
            <>
              <input
                id="licenseUpload"
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => field.onChange(e.target.files)}
              />
              <button
                type="button"
                onClick={() =>
                  document.getElementById("licenseUpload")?.click()
                }
                className="px-4 py-1.5 text-sm font-medium text-white bg-gray-700 rounded hover:bg-gray-800"
              >
                {licenseCardPreview || watchFields[2]?.[0]
                  ? "Change License Card"
                  : "Upload License Card"}
              </button>

              {watchFields[2]?.[0] ? (
                watchFields[2][0].type.startsWith("image/") && (
                  <div className="w-full mt-2 overflow-hidden border rounded-md">
                    <Image
                      src={URL.createObjectURL(watchFields[2][0])}
                      alt="License Preview"
                      width={400}
                      height={250}
                      className="object-cover w-full h-auto rounded-md"
                    />
                  </div>
                )
              ) : licenseCardPreview ? (
                <div className="w-full mt-2 overflow-hidden border rounded-md">
                  <Image
                    src={licenseCardPreview}
                    alt="License Preview"
                    width={400}
                    height={250}
                    className="object-cover w-full h-auto rounded-md"
                  />
                </div>
              ) : null}
            </>
          )}
        />
      </div>
      {licenseCardPreview && (
        <p className="text-sm text-gray-700">
          License Status:{" "}
          <span
            className={
              licenseStatus === "approved"
                ? "text-green-600"
                : licenseStatus === "rejected"
                ? "text-red-600"
                : "text-yellow-600"
            }
          >
            {licenseStatus}
          </span>
        </p>
      )}

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
        disabled={isSubmitting || !isComplete}
        className={`w-full py-2.5 font-semibold text-white ${
          isComplete ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300"
        } rounded-lg transition-all duration-200`}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
