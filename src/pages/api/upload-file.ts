import { put } from "@vercel/blob";
import formidable, { IncomingForm, File as FormidableFile } from "formidable";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

// Disable Next.js body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method Not Allowed" });

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing file:", err);
      return res.status(500).json({ error: "File parsing error" });
    }

    const uploaded = files.file;

    // ✅ Handle possible array or undefined
    const file = Array.isArray(uploaded)
      ? uploaded[0]
      : (uploaded as FormidableFile);

    if (!file || !file.filepath) {
      return res.status(400).json({ error: "No valid file found." });
    }

    const stream = fs.createReadStream(file.filepath);

    try {
      const blob = await put(
        file.originalFilename || file.newFilename,
        stream,
        {
          access: "public",
        }
      );

      return res.status(200).json({ url: blob.url });
    } catch (uploadError) {
      console.error("Upload failed:", uploadError);
      return res.status(500).json({ error: "Upload failed" });
    }
  });
}
