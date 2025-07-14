import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method !== "POST") {
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

    const userRes = await db.query(
      "SELECT name, email, password FROM users WHERE id = $1",
      [id]
    );
    const user = userRes.rows[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    await db.query(
      `INSERT INTO admins (email, password, name, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [user.email, user.password, user.name || "Admin"]
    );

    await db.query("DELETE FROM users WHERE id = $1", [id]);

    return res
      .status(200)
      .json({ message: "User promoted and removed from user table." });
  } catch (error) {
    console.error("🔥 Promote user error:", error);
    return res.status(500).json({ error: "Failed to promote user" });
  }
}
