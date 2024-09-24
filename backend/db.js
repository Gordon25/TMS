const mysql = require("mysql2/promise");

const asyncConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PW,
});

module.exports = asyncConnection;
