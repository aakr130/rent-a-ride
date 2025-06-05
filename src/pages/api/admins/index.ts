import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = parse(req.headers.cookie || "").access_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      role: string;
    };
    if (decoded.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });

    const result = await db.query(
      `SELECT id, name, email, created_at FROM admins ORDER BY created_at DESC`
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Admin list error:", err);
    return res.status(500).json({ error: "Failed to fetch admins" });
  }
}
