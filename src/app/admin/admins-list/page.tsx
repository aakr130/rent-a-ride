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

type Admin = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export default function AdminsListPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const updated = await fetch("/api/admins");
        const fresh = await updated.json();
        setAdmins(fresh);
      } catch {
        toast.error("Failed to load admins");
      } finally {
        setLoading(false);
      }
    };
    fetchAdmins();
  }, []);
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch("/api/admins/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const newAdmin = await res.json();

      if (!res.ok) throw new Error(newAdmin.error || "Failed to add admin");

      toast.success("✅ Admin added");
      setAdmins((prev) => [newAdmin, ...prev]);
      setForm({ name: "", email: "", password: "" });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    const res = await fetch(`/api/admins/${deletingId}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      toast.success("Admin deleted");
      setAdmins((prev) => prev.filter((a) => a.id !== deletingId));
    } else {
      toast.error(data.error || "Failed to delete admin");
    }
    setDeletingId(null);
  };

  return (
    <main className="max-w-5xl p-6 mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600"
        >
          <ArrowLeft size={18} />
        </button>
      </div>
      <h1 className="mb-6 text-3xl font-bold">Manage Admins</h1>

      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3"
      >
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input"
          required
        />
        <input
          type="password"
          placeholder="Password (min. 6 chars)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input"
          minLength={6}
          required
        />

        <button
          type="submit"
          disabled={form.password.length < 6}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded cursor-pointer hover:bg-blue-700 md:col-span-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Admin
        </button>
      </form>

      {loading ? (
        <p>
          <Spinner />
        </p>
      ) : (
        <table className="w-full border border-gray-300 table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="p-2 border">{admin.id}</td>
                <td className="p-2 border">{admin.name}</td>
                <td className="p-2 border">{admin.email}</td>
                <td className="p-2 border">
                  {new Date(admin.created_at).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        onClick={() => setDeletingId(admin.id)}
                        className="text-sm text-red-600 cursor-pointer hover:underline"
                      >
                        Delete
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete {admin.email}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action is permanent and will remove the admin.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="cursor-pointer"
                          onClick={confirmDelete}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
