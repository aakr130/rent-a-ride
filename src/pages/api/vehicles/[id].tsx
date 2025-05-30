import { db } from "@/app/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid vehicle ID" });
  }

  if (req.method === "GET") {
    try {
      const result = await db.query("SELECT * FROM vehicles WHERE id = $1", [
        id,
      ]);
      const vehicle = result.rows[0];
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      return res.status(200).json(vehicle);
    } catch (error) {
      console.error("❌ GET error:", error);
      return res.status(500).json({ error: "Failed to fetch vehicle" });
    }
  }

  if (req.method === "PUT") {
    const { name, price, rating, location, description } = req.body;
    try {
      await db.query(
        `UPDATE vehicles SET name = $1, price = $2, rating = $3, location = $4, description = $5 WHERE id = $6`,
        [name, price, rating, location, description, id]
      );
      return res.status(200).json({ message: "Vehicle updated successfully." });
    } catch (error) {
      console.error("❌ PUT error:", error);
      return res.status(500).json({ error: "Failed to update vehicle" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await db.query("DELETE FROM vehicles WHERE id = $1", [id]);
      return res.status(200).json({ message: "Vehicle deleted successfully." });
    } catch (error) {
      console.error("❌ DELETE error:", error);
      return res.status(500).json({ error: "Failed to delete vehicle" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}
