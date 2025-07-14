import { db } from "@/app/lib/db";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getUserFromToken(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    const {
      vehicle_id,
      start_date,
      end_date,

      duration_value,
      payment_method,
      estimated_price,
    } = req.body;

    if (
      !vehicle_id ||
      !start_date ||
      !end_date ||
      !duration_value ||
      !payment_method ||
      estimated_price == null
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const conflictResult = await db.query(
      `SELECT 1 FROM bookings 
       WHERE vehicle_id = $1 
       AND NOT (end_date < $2 OR start_date > $3)
       LIMIT 1`,
      [vehicle_id, start_date, end_date]
    );

    if (conflictResult.rows.length > 0) {
      return res
        .status(409)
        .json({ error: "Vehicle already booked for selected dates" });
    }

    const insertResult = await db.query(
      `INSERT INTO bookings 
   (user_id, vehicle_id, start_date, end_date,duration_value, payment_method, estimated_price)
   VALUES ($1, $2, $3, $4, $5, $6,$7)
   RETURNING *`,
      [
        user.id,
        vehicle_id,
        start_date,
        end_date,

        duration_value,
        payment_method,
        estimated_price,
      ]
    );

    return res.status(201).json(insertResult.rows[0]);
  }

  if (req.method === "GET") {
    const result = await db.query(
      `SELECT 
       b.*, 
       v.name AS vehicle_name, 
       v.images[1] AS image_url,
       v.type AS vehicle_type  -- ✅ This line ensures the correct type is passed
     FROM bookings b
     JOIN vehicles v ON b.vehicle_id = v.id
     WHERE b.user_id = $1
     ORDER BY b.start_date DESC`,
      [user.id]
    );

    return res.status(200).json(result.rows);
  }

  res.status(405).json({ error: "Method Not Allowed" });
}
