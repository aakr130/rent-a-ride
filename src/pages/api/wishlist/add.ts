import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const user_id = decoded.id;
    const { vehicle_id } = req.body;

    if (!vehicle_id)
      return res.status(400).json({ error: "Missing vehicle ID" });

    const existing = await db.query(
      `SELECT * FROM wishlists WHERE user_id = $1 AND vehicle_id = $2`,
      [user_id, vehicle_id]
    );
    if ((existing.rowCount ?? 0) > 0) {
      return res.status(200).json({ message: "Already in wishlist" });
    }

    await db.query(
      `INSERT INTO wishlists (user_id, vehicle_id, created_at) VALUES ($1, $2, NOW())`,
      [user_id, vehicle_id]
    );

    return res.status(200).json({ message: "Added to wishlist" });
  } catch (err) {
    console.error("❌ Wishlist Add Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
