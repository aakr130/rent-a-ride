"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name is too short"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const watchedPassword = watch("password");

  useEffect(() => {
    if (watchedPassword) {
      setPasswordStrength({
        length: watchedPassword.length >= 6,
        hasNumber: /\d/.test(watchedPassword),
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(watchedPassword),
      });
    }
  }, [watchedPassword]);

  const onSubmit = async (data: SignupFormData) => {
    const { confirmPassword, ...payload } = data;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Signup successful");
        window.location.href = "/login";
      } else {
        toast.error(result.message || "Signup failed");
      }
    } catch (err) {
      toast.error("Signup error");
      console.error(err);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-b from-white via-slate-300 to-white">
      <Toaster position="top-right" />
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 shadow-2xl rounded-2xl">
        <div className="flex items-center justify-center gap-2">
          <Image src="/images/logo.png" alt="Logo" width={82} height={82} />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
            Create an Account
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Let's get you on the road.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <input
            {...register("fullName")}
            placeholder="Full Name"
            className="input"
          />
          {errors.fullName && (
            <p className="text-sm text-red-500 font-medium flex items-center gap-1">
              <XCircle size={14} />
              {errors.fullName.message}
            </p>
          )}

          <input
            {...register("email")}
            placeholder="Email Address"
            className="input"
          />
          {errors.email && (
            <p className="text-sm text-red-500 font-medium flex items-center gap-1">
              <XCircle size={14} />
              {errors.email.message}
            </p>
          )}

          <div className="space-y-2">
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
            
            {watchedPassword && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-600">Password requirements:</p>
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 text-xs ${passwordStrength.length ? 'text-green-600' : 'text-red-500'}`}>
                    {passwordStrength.length ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    At least 6 characters
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordStrength.hasNumber ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    Contains a number
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${passwordStrength.hasSpecial ? 'text-green-600' : 'text-gray-400'}`}>
                    {passwordStrength.hasSpecial ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    Contains a special character
                  </div>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                <XCircle size={14} />
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              placeholder="Confirm Password"
              className="pr-10 input"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute text-gray-500 transform -translate-y-1/2 top-1/2 right-3"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 font-medium flex items-center gap-1">
              <XCircle size={14} />
              {errors.confirmPassword.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white transition-transform duration-200 rounded-lg shadow-md cursor-pointer bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-black hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
