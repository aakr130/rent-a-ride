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
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const {
      name,
      email,
      profile_image_url,
      password,
      phone_number,
      address,
      license_card_url,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Always update name, email, image
    await db.query(
      `UPDATE users 
       SET name = $1, email = $2, profile_image_url = $3,phone_number = $4, address = $5, license_card_url = $6, is_new_user = FALSE, updated_at = NOW()
       WHERE id = $7`,
      [
        name.trim(),
        email.trim(),
        profile_image_url,
        phone_number,
        address,
        license_card_url,
        decoded.id,
      ]
    );

    // Update password if provided (and not blank)
    if (password && password.trim() !== "") {
      await db.query(`UPDATE users SET password = $1 WHERE id = $2`, [
        password.trim(),
        decoded.id,
      ]);
    }

    return res.status(200).json({ message: "Profile updated successfully." });
  } catch (err) {
    console.error("🔥 Profile Update Error:", err);
    return res
      .status(500)
      .json({ message: "Server error during profile update" });
  }
}
