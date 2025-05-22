"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("Login successful");
        localStorage.setItem("user", JSON.stringify(result.user));
        window.location.href = "/dashboard";
      } else {
        toast.error(result.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-b from-white via-slate-300 to-white">
      <Toaster position="top-right" />
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 shadow-2xl rounded-2xl">
        <div className="flex items-center justify-center gap-2">
          <Image src="/images/logo.png" alt=" Logo" width={82} height={82} />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-gray-600">Ready to hit the road?</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-5">
          <input {...register("email")} placeholder="Email" className="input" />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Password"
              className="pr-10 input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-500 transform -translate-y-1/2 top-1/2 right-3"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-black">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 text-black border-gray-300 rounded"
              />
              Remember me
            </label>

            <Link
              href="/reset-password"
              className="text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white transition-transform duration-200 rounded-lg shadow-md cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105"
          >
            Login
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute w-full border-t border-gray-200"></div>
            <span className="relative px-4 text-sm text-gray-500 bg-white">
              OR
            </span>
          </div>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-black hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
