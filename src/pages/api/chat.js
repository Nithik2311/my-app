// src/pages/api/chat.js

import { GoogleGenerativeAI } from "@google/generative-ai";

// This console.log will appear in your terminal where the Next.js server is running
console.log("GEMINI_API_KEY from env (API Route):", process.env.GEMINI_API_KEY ? "Key Loaded" : "Key NOT Loaded");

// Initialize the Generative AI model
// This only runs on the server, so GEMINI_API_KEY is used directly
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default async function handler(req, res) {
  // Only allow POST requests for sending messages
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { prompt, source, destination } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    const chatPrompt = `
      You are a helpful bus travel assistant for Chennai.
      ${source && destination ? `The user is currently planning a trip from ${source} to ${destination}.` : ''}
      The user asked: "${prompt}"

      Please provide a concise and practical response (1-3 sentences) considering the following:
      - **Bus routes and numbers**
      - **Approximate fares**
      - **Travel time estimates**
      - **Alternative transportation options** (if buses are not ideal)
      - **Accessibility information**
      - **Current traffic conditions** (if relevant to travel time, mention that real-time data isn't available to you)
      - **Safety tips**

      If the question is not related to bus travel in Chennai, politely explain that you specialize in Chennai bus information.
      Avoid making up bus routes or details if you don't know them; instead, suggest checking official MTC resources or a real-time bus tracking app.
      Keep the language helpful and encouraging.
    `;

    const result = await model.generateContent(chatPrompt);
    const responseText = result.response.text();

    res.status(200).json({ text: responseText });

  } catch (error) {
    console.error("Error calling Gemini API:", error);

    // Provide more specific error messages if possible
    let errorMessage = "An error occurred while processing your request. Please try again later.";
    let statusCode = 500;

    if (error.response) {
      if (error.response.status === 400 && error.response.errorInfo && error.response.errorInfo.reason === "API_KEY_INVALID") {
        errorMessage = "Server-side API key invalid. Please check your .env.local file and Google Cloud Console settings.";
        statusCode = 500; // Still 500 for the client, but clearer server-side
      } else if (error.response.status === 400) {
        errorMessage = `Bad request to Gemini API: ${error.response.statusText || 'Unknown error'}. Check prompt formatting.`;
        statusCode = 400;
      } else if (error.response.status === 429) {
        errorMessage = "Too many requests to the AI. Please wait a moment before trying again.";
        statusCode = 429;
      } else if (error.response.status === 500) {
        errorMessage = "Gemini API internal server error. Please try again later.";
        statusCode = 500;
      } else {
        errorMessage = `Gemini API error: ${error.response.status} - ${error.response.statusText || 'Unknown error'}`;
        statusCode = error.response.status;
      }
    } else if (error.message) {
        errorMessage = `Network error or unexpected response: ${error.message}`;
        statusCode = 500;
    }

    res.status(statusCode).json({ message: errorMessage });
  }
}