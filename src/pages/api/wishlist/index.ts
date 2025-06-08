import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  let user_id: number;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    user_id = decoded.id;
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (req.method === "POST") {
    const { vehicle_id } = req.body;

    if (!vehicle_id)
      return res.status(400).json({ error: "Missing vehicle ID" });

    try {
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

  if (req.method === "GET") {
    try {
      const result = await db.query(
        `
        SELECT v.*
        FROM wishlists w
        JOIN vehicles v ON w.vehicle_id = v.id
        WHERE w.user_id = $1
      `,
        [user_id]
      );

      return res.status(200).json(result.rows);
    } catch (err) {
      console.error("❌ Wishlist Fetch Error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  if (req.method === "DELETE") {
    const { vehicle_id } = req.body;
    if (!vehicle_id)
      return res.status(400).json({ error: "Missing vehicle ID" });

    try {
      await db.query(
        `DELETE FROM wishlists WHERE user_id = $1 AND vehicle_id = $2`,
        [user_id, vehicle_id]
      );

      return res.status(200).json({ message: "Removed from wishlist" });
    } catch (err) {
      console.error("❌ Wishlist Delete Error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
