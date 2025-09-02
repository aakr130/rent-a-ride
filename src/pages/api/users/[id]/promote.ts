import { db } from "@/app/lib/db";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";

const JWT_SECRET = process.env.JWT_SECRET as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cookies = parse(req.headers.cookie || "");
  const token = cookies.access_token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: "user" | "admin";
    };

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    const { id } = req.query;

     if (!id || Array.isArray(id)) {
      return res.status(400).json({
        error: "Invalid user ID",
        message: "Please provide a valid user ID."
      });
    }

   
   
    const userCheck = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
        message: "The user you're trying to promote doesn't exist."
      });
    }

    
    const adminCheck = await db.query("SELECT * FROM admins WHERE email = $1", [userCheck.rows[0].email]);
    if (adminCheck.rows.length > 0) {
      return res.status(409).json({
        error: "User already admin",
        message: "This user is already an admin."
      });
    }


    const client = await db.connect();
   
    try {
      await client.query('BEGIN');
     
    
      await client.query(
        "INSERT INTO admins (email, password, name, created_at) VALUES ($1, $2, $3, NOW())",
        [userCheck.rows[0].email, userCheck.rows[0].password, userCheck.rows[0].name]
      );

      
      await client.query("DELETE FROM users WHERE id = $1", [id]);
     
      await client.query('COMMIT');
     
      return res.status(200).json({
        success: true,
        message: "User promoted to admin successfully!"
      });
     
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error: any) {
    console.error("❌ Promotion error:", error);
   
   
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: "Invalid token",
        message: "Your session has expired. Please login again."
      });
    }
   
    
    if (error.code === '23505') {
      return res.status(409).json({
        error: "Duplicate admin",
        message: "This user is already an admin."
      });
    }
   
    if (error.code === '23503') { 
      return res.status(400).json({
        error: "Invalid user",
        message: "Cannot promote this user. User data is invalid."
      });
    }

    return res.status(500).json({
      error: "Promotion failed",
      message: "Failed to promote user. Please try again."
    });
  }
}
