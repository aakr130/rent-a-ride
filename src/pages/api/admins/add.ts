import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const token = parse(req.headers.cookie || "").access_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      role: string;
    };
    if (decoded.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });

    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: "Missing fields" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });

    const result = await db.query(
      `INSERT INTO admins (name, email, password, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, name, email, created_at`,
      [name, email, password]
    );

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Add admin error:", err);
    return res.status(500).json({ error: "Failed to add admin" });
  }
}
