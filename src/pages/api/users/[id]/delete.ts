import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cookies = parse(req.headers.cookie || "");
  const token = cookies.access_token;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      role: string;
    };
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const result = await db.query("DELETE FROM users WHERE id = $1", [id]);
    return res.status(200).json({ message: "User deleted." });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ error: "Failed to delete user" });
  }
}
