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

  const bookingId = parseInt(req.query.id as string);

  if (req.method === "PATCH") {
    const { status } = req.body;

    if (!["Pending", "Confirmed", "Rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const update = await db.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, bookingId]
    );

    return res.status(200).json(update.rows[0]);
  }

  res.status(405).json({ error: "Method Not Allowed" });
}
