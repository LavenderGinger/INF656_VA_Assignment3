import "dotenv/config";
import express from "express";
import app from "./app.js";
import { connectToDatabase } from "./data/dataMongo.js";

const PORT = process.env.PORT ?? 3000;

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
}

startServer();