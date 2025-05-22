import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db"; // adjust path if needed

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("✅ SIGNUP ROUTE HIT");
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fullName, email, password } = req.body as {
      fullName: string;
      email: string;
      password: string;
    };

    // Validate input
    if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user exists
    const [existingRows] = await db.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    const existing = existingRows as any[];

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered." });
    }

    // Insert user
    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [fullName.trim(), email.trim(), password.trim()]
    );

    return res.status(201).json({ message: "Signup successful." });
  } catch (err) {
    console.error("🔥 SIGNUP ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
