"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  country: string;
  phone: string;
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    email: "",
    password: "",
    country: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup form submitted:", formData);
  };

  return (
    <main className="flex items-center justify-center min-h-screen px-4 py-10 bg-gradient-to-b from-white via-slate-300 to-white">
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 shadow-2xl rounded-2xl">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Qent Logo"
            width={82}
            height={82}
          />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
            Create an Account
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Let’s get you on the road.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            required
            className="w-full px-4 py-3 text-sm text-black border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.fullName}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className="w-full px-4 py-3 text-sm text-black border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            required
            className="w-full px-4 py-3 text-sm text-black border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.phone}
            onChange={handleChange}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 pr-10 text-sm text-black border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-500 transform -translate-y-1/2 top-1/2 right-3"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white transition-transform duration-200 rounded-lg shadow-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:scale-105"
          >
            Sign Up
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute w-full border-t border-gray-200"></div>
            <span className="relative px-4 text-sm text-gray-500 bg-white">
              OR
            </span>
          </div>
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
