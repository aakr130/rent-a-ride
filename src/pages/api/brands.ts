import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await db.query(`
  SELECT DISTINCT LOWER(brand) AS name
  FROM vehicles
  WHERE brand IS NOT NULL AND TRIM(brand) != ''
`);
    const brandLogos: Record<string, string> = {
      Tesla: "/images/tesla.jpg",
      BMW: "/images/bmw.jpg",
      Ferrari: "/images/ferr.jpg",
      Lamborghini: "/images/lamb.jpg",
    };

    const brands = result.rows.map((row: any, i: number) => ({
      id: i + 1,
      name: row.brand,
      logo: brandLogos[row.brand] || "/images/default.jpg",
    }));

    res.status(200).json(brands);
  } catch (err) {
    console.error("🔥 Brand fetch error:", err);
    res.status(500).json({ error: "Failed to fetch brands" });
  }
}
