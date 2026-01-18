// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

dotenv.config();

const app = express();
app.use(cors());

const client = new ElevenLabsClient({ apiKey: process.env.ELEVEN_API_KEY });

// Endpoint to generate single-use token
app.get("/scribe-token", async (req, res) => {
  try {
    const token = await client.tokens.singleUse.create("realtime_scribe");
    res.json(token);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create token");
  }
});

app.listen(4001, () => console.log("Backend running on http://localhost:4001"));
