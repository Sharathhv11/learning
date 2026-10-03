const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

const client = new MongoClient(MONGO_URI);

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);

    app.get("/users", async (req, res) => {
      try {
        const users = await db.collection("userInfo").find({}).toArray();

        res.json({
          users,
          message: "hello",
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          error: "Failed to fetch users",
        });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

startServer();
