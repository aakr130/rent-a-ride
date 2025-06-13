import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";
import { parse } from "cookie";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.access_token;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
  if (decoded.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const result = await db.query(
    `SELECT id, name, email, phone_number, address, license_card_url, license_status
     FROM users WHERE license_card_url IS NOT NULL`
  );

  return res.status(200).json({ users: result.rows });
}
