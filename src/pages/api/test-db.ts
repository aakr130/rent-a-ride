import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/app/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await db.query("SELECT NOW() as current_time");
    
    return res.status(200).json({ 
      success: true, 
      message: "Database connection successful",
      timestamp: result.rows[0].current_time,
      hasDatabaseUrl: !!process.env.DATABASE_URL
    });
  } catch (err: any) {
    console.error("❌ Database test failed:", err.message);
    console.error("❌ Error code:", err.code);
    console.error("❌ Error detail:", err.detail);
    
    return res.status(500).json({ 
      success: false, 
      error: err.message,
      code: err.code,
      hasDatabaseUrl: !!process.env.DATABASE_URL
    });
  }
}
