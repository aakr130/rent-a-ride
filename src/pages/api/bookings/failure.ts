import { NextApiRequest, NextApiResponse } from "next";

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  res.redirect("/bookings/confirmation?status=fail");
}
