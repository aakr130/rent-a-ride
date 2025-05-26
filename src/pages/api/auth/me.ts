import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { db } from "@/app/lib/db"; // adjust if needed

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.access_token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };

    const result = await db.query(
      "SELECT id, name, email, profile_image_url FROM users WHERE id = $1",
      [decoded.id]
    );

    const user = result.rows[0];

    return res.status(200).json({
      authenticated: true,
      user,
    });
  } catch {
    return res.status(401).json({ authenticated: false });
  }
}
