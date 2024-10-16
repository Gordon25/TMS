import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { db } from "./utils/db.js";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

async function shutdownDatabase() {
  console.log("Received shutdown signal, closing database connection...");
  try {
    await db.end();
    console.log("Connection closed.");
  } catch (error) {
    console.error("Error closing connection pool:", error);
  } finally {
    process.exit(0);
  }
}

// Listen for termination signals
process.on("SIGINT", shutdownDatabase);
process.on("SIGTERM", shutdownDatabase);

export default app;
