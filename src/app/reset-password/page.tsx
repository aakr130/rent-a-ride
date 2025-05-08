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
    <main className="min-h-screen bg-white flex flex-col">
      <div className="p-6 pt-10">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Qent Logo"
            width={32}
            height={32}
          />
          <span className="font-bold text-xl">Qent</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
          <p className="text-gray-600 mb-8">
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

          <div className="text-center mt-6">
            <Link href="/login" className="text-gray-600 text-sm">
              Return to sign in
            </Link>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm">
              Create a{" "}
              <Link href="/signup" className="text-black font-medium">
                New account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
