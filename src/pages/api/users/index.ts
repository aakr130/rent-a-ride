import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cookies = parse(req.headers.cookie || "");
  const token = cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      role: "user" | "admin";
    };

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    const result = await db.query(`
      SELECT id, name, email, created_at FROM users ORDER BY created_at DESC
    `);

    const users = result.rows.map((u) => ({
      ...u,
      role: "user",
    }));

    return res.status(200).json(users);
  } catch (error) {
    console.error("❌ Users API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
