import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
// set up app
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true })); // Setup the body parser to handle form submits
app.use(cookieParser()); // to populate session cookies during login
app.use(express.json());
app.use(session({ secret: "super-secret" })); // Session setup
export default app;
