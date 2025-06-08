// pages/api/wishlist/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const user_id = decoded.id;
    const vehicle_id = parseInt(req.query.id as string);

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
