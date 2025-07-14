"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Spinner from "@/app/icons/spinner";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

export default function ManageUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<"promote" | "delete" | null>(
    null
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err: any) {
        toast.error(err.message || "Error loading users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleAction = async () => {
    if (!selectedUser || !actionType) return;
    const { id, email } = selectedUser;

    try {
      const res = await fetch(`/api/users/${id}/${actionType}`, {
        method: actionType === "promote" ? "POST" : "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      toast.success(
        actionType === "promote"
          ? `${email} promoted to admin`
          : `${email} deleted`
      );

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to perform action");
    } finally {
      setSelectedUser(null);
      setActionType(null);
    }
  };

  return (
    <main className="max-w-6xl p-6 mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      <h1 className="mb-6 text-3xl font-bold text-gray-800">Manage Users</h1>

      {loading ? (
        <p className="text-gray-600">
          <Spinner />
        </p>
      ) : (
        <table className="w-full border border-gray-300 table-auto">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-sm text-gray-800">
                <td className="p-2 border">{user.id}</td>
                <td className="p-2 border">{user.name || "-"}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 capitalize border">{user.role}</td>
                <td className="p-2 border">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  <div className="flex gap-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setActionType("promote");
                          }}
                          className="p-2 text-white bg-blue-600 rounded-2xl hover:underline"
                        >
                          Promote
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Promote {user.email} to Admin?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will give admin privileges to the user.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleAction}>
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setActionType("delete");
                          }}
                          className="p-2 text-white bg-red-600 rounded-2xl hover:underline"
                        >
                          Delete
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete {user.email}?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action is permanent and cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleAction}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </main>
  );
}
