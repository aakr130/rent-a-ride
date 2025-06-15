import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const { amt, rid, pid, scd } = req.body;
  const verifyUrl = "https://uat.esewa.com.np/epay/transrec";

  try {
    const response = await axios.post(
      verifyUrl,
      new URLSearchParams({ amt, rid, pid, scd }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const data = response.data;
    if (data.includes("Success")) {
      return res.redirect(`/my-booking/confirmation?status=success`);
    }
    return res.redirect(`/my-booking/confirmation?status=fail`);
  } catch {
    return res.redirect(`/bookings/confirmation?status=error`);
  }
}
