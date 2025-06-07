import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { db } from "@/app/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // 1. Verify access token
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    const {
      name,
      images,
      price,
      rating,
      seats,
      location,
      description,
      type,
      tags = [],
      brand,
      color,
      fuel_type,
    } = req.body;

    if (
      !name ||
      !images?.length ||
      !price ||
      !rating ||
      !seats ||
      !location ||
      !description ||
      !type ||
      !brand ||
      !color ||
      !fuel_type
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 3. Insert into `vehicles` table (with array of images)
    await db.query(
      `INSERT INTO vehicles 
      (name, images, price, rating, seats, location, description, type, tags,brand,color, fuel_type, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11, $12, NOW())`,
      [
        name,
        images,
        price,
        rating,
        seats,
        location,
        description,
        type,

        tags,
        brand,
        color,
        fuel_type,
      ]
    );

    return res
      .status(200)
      .json({ success: true, message: "Vehicle added successfully." });
  } catch (error) {
    console.error("🔥 Vehicle Add Error:", error);
    return res
      .status(500)
      .json({ message: "Server error while adding vehicle." });
  }
}
