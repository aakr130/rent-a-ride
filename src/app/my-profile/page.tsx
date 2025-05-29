"use client";

import { useUser } from "@/app/hooks/useUser";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <main className="max-w-2xl px-6 py-12 mx-auto mt-20 bg-white shadow-lg rounded-2xl">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">
        My Profile
      </h1>

      <div className="flex flex-col items-center mb-6">
        <Image
          src={user.profile_image_url || "/images/default-avatar.png"}
          alt="Profile"
          width={100}
          height={100}
          className="object-cover rounded-full ring-2 ring-gray-300"
        />
        <p className="mt-4 text-lg font-medium text-gray-700">{user.name}</p>
        <p className="text-gray-500">{user.email}</p>
      </div>

      <div className="p-4 mb-6 bg-gray-100 rounded">
        <pre className="text-sm text-gray-800 break-words whitespace-pre-wrap">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="flex justify-between gap-4">
        <button
          onClick={() => router.push("/edit-profile")}
          className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          ✏️ Edit Profile
        </button>

        <button
          onClick={() =>
            window.open(
              "mailto:support@yourdomain.com?subject=Feedback from user"
            )
          }
          className="w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          💬 Send Feedback
        </button>
      </div>
    </main>
  );
}
