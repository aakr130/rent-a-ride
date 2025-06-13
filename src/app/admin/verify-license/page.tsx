"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

type User = {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  license_card_url: string | null;
  license_status: "pending" | "approved" | "rejected";
};

export default function VerifyLicense() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admins/users-with-license");
        const data = await res.json();
        setUsers(data.users);
      } catch (err) {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const verifyLicense = async (
    userId: number,
    status: "approved" | "rejected"
  ) => {
    try {
      const res = await fetch("/api/admins/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, status }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Error");

      toast.success(`License ${status}`);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, license_status: status } : u
        )
      );
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="max-w-4xl p-6 mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">License Verifications</h1>
      {users.length === 0 && <p>No users with license uploaded.</p>}
      {users.map((user) => (
        <div
          key={user.id}
          className="flex flex-col gap-3 p-4 border rounded-lg shadow"
        >
          <div className="text-gray-800">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone_number || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {user.address || "N/A"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  user.license_status === "approved"
                    ? "text-green-600"
                    : user.license_status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                }
              >
                {user.license_status}
              </span>
            </p>
          </div>

          {user.license_card_url && (
            <Image
              src={user.license_card_url}
              alt="License"
              width={400}
              height={250}
              className="object-cover border rounded"
            />
          )}

          <div className="flex gap-4 mt-2">
            {user.license_status === "pending" && (
              <>
                <button
                  onClick={() => verifyLicense(user.id, "approved")}
                  className="px-4 py-1.5 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => verifyLicense(user.id, "rejected")}
                  className="px-4 py-1.5 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </>
            )}

            {user.license_status === "approved" && (
              <button
                onClick={() => verifyLicense(user.id, "rejected")}
                className="px-4 py-1.5 text-sm text-white bg-red-600 rounded hover:bg-red-700"
              >
                Reject
              </button>
            )}

            {user.license_status === "rejected" && (
              <button
                onClick={() => verifyLicense(user.id, "approved")}
                className="px-4 py-1.5 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              >
                Approve
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
