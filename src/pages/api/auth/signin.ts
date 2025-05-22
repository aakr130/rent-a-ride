import { db } from "@/app/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required." });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.setHeader(
      "Set-Cookie",
      serialize("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      })
    );

    return res.status(200).json({
      message: "Login successful.",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error." });
  }
}
