import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import "dotenv/config";
import fetch from "node-fetch";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVEN_API_KEY
});

async function main() {
  // Example: fetch a sample audio file (can be any .mp3/.wav)
  const audioUrl = "https://storage.googleapis.com/eleven-public-cdn/audio/marketing/nicole.mp3";
  const response = await fetch(audioUrl);
  const audioBlob = new Blob([await response.arrayBuffer()], { type: "audio/mp3" });

  const transcription = await elevenlabs.speechToText.convert({
    file: audioBlob,
    modelId: "scribe_v2",
    tagAudioEvents: true,        // optional
    languageCode: "eng",         // optional
    diarize: true                // optional: who is speaking
  });

  console.log("Transcription:", transcription.text);
}

main();
