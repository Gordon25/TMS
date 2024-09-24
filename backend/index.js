const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./routeTable.js");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // Setup the body parser to handle form submits
app.use(cookieParser()); // to populate session cookies during login
app.use(express.json());
app.use(session({ secret: "super-secret" })); // Session setup
app.use(router);
app.listen(
  process.env.PORT,
  console.log(`App listening at port ${process.env.PORT} ${process.env.NODE_ENV}`)
);
