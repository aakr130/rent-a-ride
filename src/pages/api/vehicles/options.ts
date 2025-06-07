import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const [colors, fuelTypes, rentalTimes, seatCounts, locations] =
      await Promise.all([
        db.query(
          `SELECT DISTINCT color FROM vehicles WHERE type = 'car' AND color IS NOT NULL`
        ),
        db.query(
          `SELECT DISTINCT fuel_type FROM vehicles WHERE type = 'car' AND fuel_type IS NOT NULL`
        ),
        db.query(
          `SELECT DISTINCT rental_time_option FROM vehicles WHERE type = 'car' AND rental_time_option IS NOT NULL`
        ),
        db.query(
          `SELECT DISTINCT seats FROM vehicles WHERE type = 'car' AND seats IS NOT NULL`
        ),
        db.query(
          `SELECT DISTINCT location FROM vehicles WHERE type = 'car' AND location IS NOT NULL`
        ),
      ]);

    res.status(200).json({
      colors: colors.rows.map((r) => r.color),
      fuelTypes: fuelTypes.rows.map((r) => r.fuel_type),
      rentalTimes: rentalTimes.rows.map((r) => r.rental_time_option),
      seats: seatCounts.rows.map((r) => r.seats),
      locations: locations.rows.map((r) => r.location),
    });
  } catch (err) {
    console.error("Error loading filter options:", err);
    res.status(500).json({ error: "Failed to load filter options" });
  }
}
