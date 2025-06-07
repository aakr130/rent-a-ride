import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    type,
    brand,
    color,
    fuel_type,

    seats,
    price_min,
    price_max,
    location, // 👈 added
  } = req.query;

  if (!type) {
    return res.status(400).json({ error: "Vehicle type is required" });
  }

  try {
    let baseQuery = `SELECT * FROM vehicles WHERE type = $1`;
    const conditions: string[] = [];
    const values: any[] = [type];

    if (brand) {
      values.push(brand);
      conditions.push(`LOWER(brand) = LOWER($${values.length})`);
    }

    if (color) {
      values.push(color);
      conditions.push(`color = $${values.length}`);
    }

    if (fuel_type) {
      values.push(fuel_type);
      conditions.push(`fuel_type = $${values.length}`);
    }

    if (seats) {
      values.push(Number(seats));
      conditions.push(`seats = $${values.length}`);
    }

    if (price_min && price_max) {
      values.push(Number(price_min));
      conditions.push(`price >= $${values.length}`);

      values.push(Number(price_max));
      conditions.push(`price <= $${values.length}`);
    }

    if (location) {
      values.push(location);
      conditions.push(`LOWER(location) = LOWER($${values.length})`); // ✅ case-insensitive match
    }

    if (conditions.length > 0) {
      baseQuery += ` AND ` + conditions.join(" AND ");
    }

    const result = await db.query(baseQuery, values);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("🔥 Fetch all vehicles error:", error);
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
}
