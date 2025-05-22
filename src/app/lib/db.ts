import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Qwerty123$",
  database: "rent_a_ride",
});
db.getConnection()
  .then(() => console.log("✅ MySQL connected"))
  .catch((err) => console.error("❌ MySQL connect error", err));
