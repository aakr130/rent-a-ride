import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";
import cors from "@/lib/cors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);
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

    if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await db.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Email already registered." });
    }

    await db.query(
      "INSERT INTO users (name, email, password,is_new_user) VALUES ($1, $2, $3,true)",
      [fullName.trim(), email.trim(), password.trim()]
    );

    return res.status(201).json({ message: "Signup successful." });
  } catch (err) {
    console.error("🔥 SIGNUP ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
