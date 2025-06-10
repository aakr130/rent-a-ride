import { NextApiRequest } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { db } from "@/app/lib/db";

export async function getUserFromToken(req: NextApiRequest) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.access_token;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      role: "user" | "admin";
    };

    if (decoded.role === "admin") {
      const result = await db.query(
        "SELECT id, email FROM admins WHERE id = $1",
        [decoded.id]
      );
      return result.rows[0] ? { ...result.rows[0], role: "admin" } : null;
    }

    const result = await db.query(
      "SELECT id, name, email, profile_image_url FROM users WHERE id = $1",
      [decoded.id]
    );
    return result.rows[0] ? { ...result.rows[0], role: "user" } : null;
  } catch (err) {
    return null;
  }
}
