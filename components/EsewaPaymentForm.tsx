// components/EsewaPaymentForm.tsx
"use client";
import React from "react";

type Props = { amount: number; pid: string };

export default function EsewaPaymentForm({ amount, pid }: Props) {
  const mid = process.env.NEXT_PUBLIC_ESEWA_MERCHANT_ID!;
  const successUrl = process.env.NEXT_PUBLIC_ESEWA_SUCCESS_URL!;
  const failureUrl = process.env.NEXT_PUBLIC_ESEWA_FAILURE_URL!;

  const handleSubmit = () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://uat.esewa.com.np/epay/main";

    [
      { name: "amt", value: amount.toFixed(2) },
      { name: "tAmt", value: amount.toFixed(2) },
      { name: "txAmt", value: "0" },
      { name: "psc", value: "0" },
      { name: "pdc", value: "0" },
      { name: "pid", value: pid },
      { name: "scd", value: mid },
      { name: "su", value: successUrl },
      { name: "fu", value: failureUrl },
    ].forEach(({ name, value }) => {
      const input = Object.assign(document.createElement("input"), {
        type: "hidden",
        name,
        value,
      });
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <button
      type="button"
      onClick={handleSubmit}
      className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
    >
      Pay with eSewa
    </button>
  );
}
