import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { db } from "@/app/lib/db";

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
      role: "user" | "admin";
    };

    if (decoded.role === "admin") {
      const adminResult = await db.query(
        "SELECT id, email FROM admins WHERE id = $1",
        [decoded.id]
      );
      const admin = adminResult.rows[0];

      return res.status(200).json({
        authenticated: true,
        user: {
          id: admin.id,
          email: admin.email,
          role: "admin",
        },
      });
    }

    const userResult = await db.query(
      "SELECT id, name, email, profile_image_url FROM users WHERE id = $1",
      [decoded.id]
    );
    const user = userResult.rows[0];

    return res.status(200).json({
      authenticated: true,
      user: {
        ...user,
        role: "user",
      },
    });
  } catch {
    return res.status(401).json({ authenticated: false });
  }
}
