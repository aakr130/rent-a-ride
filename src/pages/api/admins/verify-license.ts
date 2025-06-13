import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const cookies = parse(req.headers.cookie || "");
  const token = cookies.access_token;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (decoded.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Only admins can verify license cards" });
  }

  const { user_id, status } = req.body;

  if (!user_id || !["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  await db.query("UPDATE users SET license_status = $1 WHERE id = $2", [
    status,
    user_id,
  ]);

  return res.status(200).json({ message: `License marked as ${status}` });
}
