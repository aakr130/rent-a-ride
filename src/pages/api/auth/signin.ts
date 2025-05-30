import { db } from "@/app/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import cors from "@/lib/cors";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await cors(req, res);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required." });
  }

  try {
    // Step 1: Check Admins first
    const adminResult = await db.query(
      "SELECT * FROM admins WHERE email = $1",
      [email]
    );
    const admin = adminResult.rows[0];

    if (admin && admin.password === password) {
      const accessToken = jwt.sign(
        { id: admin.id, email: admin.email, name: admin.name, role: "admin" },
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
        message: "Admin login successful.",
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: "admin",
        },
      });
    }

    // Step 2: Fallback to normal users
    const userResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = userResult.rows[0];

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: "user" },
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
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: "user",
      },
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error." });
  }
}
