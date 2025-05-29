// pages/api/vehicles/cars.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await db.query(`SELECT * FROM vehicles WHERE type = 'car'`);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("🔥 Fetch cars error:", error);
    res.status(500).json({ error: "Failed to fetch cars" });
  }
}
