import Cors from "cors";
import initMiddleware from "./initMiddleware";

const cors = initMiddleware(
  Cors({
    methods: ["GET", "POST", "OPTIONS"],
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "*",
    credentials: true,
  })
);

export default cors;
