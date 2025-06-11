import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";
import { getUserFromToken } from "@/lib/getUserFromToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getUserFromToken(req);

  if (!user || user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const result = await db.query(
        `SELECT 
    b.*, 
    u.name as user_name, 
    u.email as user_email,
    v.name as vehicle_name,
    v.type as vehicle_type,
    v.images[1] as image_url --  Include vehicle image
  FROM bookings b
  JOIN users u ON b.user_id = u.id
  JOIN vehicles v ON b.vehicle_id = v.id
  ORDER BY b.created_at DESC`
      );

      return res.status(200).json(result.rows);
    } catch (error) {
      console.error("🔥 Admin bookings error:", error);
      return res.status(500).json({ error: "Failed to load bookings" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
