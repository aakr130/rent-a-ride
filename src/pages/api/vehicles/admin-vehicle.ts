import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await db.query(
      "SELECT * FROM vehicles ORDER BY created_at DESC"
    );
    return res.status(200).json(result.rows); // returns an array
  } catch (error) {
    console.error("🔥 Admin Fetch Vehicles Error:", error);
    return res.status(500).json({ error: "Failed to fetch vehicles" });
  }
}
