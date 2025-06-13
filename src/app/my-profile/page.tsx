"use client";

import { useUser } from "@/app/hooks/useUser";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function MyProfilePage() {
  const { data, isLoading } = useUser();
  const router = useRouter();
  const user = data?.user;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <svg className="w-8 h-8 text-gray-600 animate-spin" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-red-500">User not found.</span>
      </div>
    );
  }

  return (
    <main className="relative max-w-2xl px-6 py-12 mx-auto mt-20 bg-white border border-gray-100 shadow-xl rounded-3xl">
      <button
        onClick={() => router.back()}
        aria-label="Go back"
        className="absolute p-2 transition rounded-full top-4 left-4 hover:bg-gray-100"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>

      <h1 className="mb-8 text-4xl font-bold text-center text-gray-900">
        My Profile
      </h1>

      <div className="flex flex-col items-center mb-8">
        <div className="relative overflow-hidden transition duration-300 rounded-full shadow-lg w-28 h-28 ring-2 ring-blue-400 hover:ring-4">
          <Image
            src={user.profile_image_url || "/images/default-avatar.png"}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <p className="mt-4 text-xl font-semibold text-gray-800">{user.name}</p>
        <p className="text-gray-500">{user.email}</p>
      </div>

      <div className="w-full px-6 py-4 mb-8 border border-blue-100 bg-blue-50 rounded-xl">
        <div className="grid gap-4 text-sm text-gray-800">
          <Item label="👤 Name" value={user.name} />
          <Item label="📧 Email" value={user.email} />
          <Item label="📱 Phone" value={user.phone_number || "Not provided"} />
          <Item label="📍 Address" value={user.address || "Not provided"} />
          <Item
            label="🖼️ Avatar"
            value={
              <a
                href={user.profile_image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline max-w-[160px] truncate text-right"
              >
                View Image
              </a>
            }
          />
          <Item
            label="🪪 License"
            value={
              user.license_card_url ? (
                <a
                  href={user.license_card_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline max-w-[160px] truncate text-right"
                >
                  View License
                </a>
              ) : (
                <span className="text-gray-400">Not uploaded</span>
              )
            }
          />
          <Item
            label="✅ License Status"
            value={
              user.license_status === "approved"
                ? "✅ Approved"
                : user.license_status === "rejected"
                ? "❌ Rejected"
                : "⏳ Pending"
            }
          />
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <button
          onClick={() => router.push("/edit-profile")}
          className="w-full px-5 py-3 font-bold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700"
        >
          ✏️ Edit Profile
        </button>

        <button
          onClick={() =>
            window.open(
              "mailto:support@yourdomain.com?subject=Feedback from user"
            )
          }
          className="w-full px-5 py-3 font-bold text-white transition-all bg-green-600 rounded-xl hover:bg-green-700"
        >
          💬 Send Feedback
        </button>
      </div>
    </main>
  );
}

function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-blue-800">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
