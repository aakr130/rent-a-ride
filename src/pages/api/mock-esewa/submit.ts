import { db } from "@/app/lib/db";
import { getUserFromToken } from "@/lib/getUserFromToken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getUserFromToken(req);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const {
    pid,
    amt,
    esewa_id,
    vehicle_id,
    start_date,
    end_date,
    duration_value,
  } = req.body;



  if (
    !pid ||
    !amt ||
    !esewa_id ||
    !vehicle_id ||
    !start_date ||
    !end_date ||
    !duration_value
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await db.query(
      `INSERT INTO mock_esewa_transactions (user_id, vehicle_id, amount, esewa_id, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, vehicle_id, amt, esewa_id, "success"]
    );

    const conflict = await db.query(
      `SELECT 1 FROM bookings WHERE vehicle_id = $1 AND NOT (end_date < $2 OR start_date > $3) LIMIT 1`,
      [vehicle_id, start_date, end_date]
    );

    if (conflict.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "Vehicle already booked for selected dates" });
    }

    await db.query(
      `INSERT INTO bookings (user_id, vehicle_id, start_date, end_date, duration_value, payment_method, estimated_price)
   VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [user.id, vehicle_id, start_date, end_date, duration_value, "esewa", amt]
    );

    return res.status(200).json({ message: "Payment and booking successful" });
  } catch (err) {
    console.error("🔥 Error in mock-esewa submit:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
