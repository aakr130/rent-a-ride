import { db } from "@/app/lib/db";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getUserFromToken(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const result = await db.query(`
    SELECT 
      b.id AS booking_id,
      b.payment_method,
      b.estimated_price,
      b.start_date,
      b.end_date,
      b.created_at,
      b.status,
      u.name AS user_name,
      v.name AS vehicle_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.created_at DESC
  `);

  return res.status(200).json(result.rows);
}
