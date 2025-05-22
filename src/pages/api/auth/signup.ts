import { db } from "@/app/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { fullName, email, password } = req.body as {
    fullName: string;
    email: string;
    password: string;
  };

  if (!fullName || !email || !password)
    return res.status(400).json({ message: "All fields are required." });

  try {
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if ((existing as any[]).length > 0) {
      return res.status(409).json({ message: "Email already registered." });
    }

    await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [fullName, email, password]
    );

    res.status(201).json({ message: "Signup successful." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
}
