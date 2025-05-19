"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Reset password for:", email);
  };

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <div className="p-6 pt-10">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Qent Logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-bold">Qent</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="w-full max-w-md mx-auto">
          <h1 className="mb-2 text-2xl font-bold">Reset your password</h1>
          <p className="mb-8 text-gray-600">
            Enter the email address associated with your account and well send
            you a link to reset your password.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Continue
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-gray-600">
              Return to sign in
            </Link>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600">
              Create a{" "}
              <Link href="/signup" className="font-medium text-black">
                New account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
