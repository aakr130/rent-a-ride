import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies.access_token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    return res.status(200).json({ authenticated: true, user });
  } catch {
    return res.status(401).json({ authenticated: false });
  }
}
