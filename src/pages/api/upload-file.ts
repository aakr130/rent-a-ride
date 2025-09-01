import { put } from "@vercel/blob";
import { IncomingForm, Files, Fields } from "formidable";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> {
  const form = new IncomingForm({
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { files } = await parseForm(req);
    const uploaded = files.file;

    if (!uploaded) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;

    if (!file || typeof file !== "object" || !("filepath" in file)) {
      return res.status(400).json({ error: "Invalid file object." });
    }

    const stream = fs.createReadStream(file.filepath);
    const filename = file.originalFilename || path.basename(file.filepath);

    const blob = await put(filename, stream, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    });

    return res.status(200).json({ url: blob.url });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Upload failed" });
  }
}
