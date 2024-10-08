import mysql from "mysql2/promise";

let connection;
async function createDBConnection() {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PW,
    });
  } catch (error) {
    console.log("Error connecting to database");
    console.log(error);
  }
}

await createDBConnection();

export { connection };
