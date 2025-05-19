import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "your_mysql_user",
  password: "your_mysql_password",
  database: "rent_a_ride",
});
