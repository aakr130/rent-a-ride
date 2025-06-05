import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Method not allowed" });

  const token = parse(req.headers.cookie || "").access_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      role: string;
    };
    if (decoded.role !== "admin")
      return res.status(403).json({ error: "Forbidden" });

    const numericId = parseInt(id as string);
    if (isNaN(numericId))
      return res.status(400).json({ error: "Invalid admin ID" });

    await db.query("DELETE FROM admins WHERE id = $1", [numericId]);
    return res.status(200).json({ message: "Admin deleted" });
  } catch (err) {
    console.error("❌ Delete admin error:", err);
    return res.status(500).json({ error: "Failed to delete admin" });
  }
}
