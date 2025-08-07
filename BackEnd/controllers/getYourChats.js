const express = require("express");

require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/UserSchema");
const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

exports.getChats = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const userinDB = await User.findOne({ email: req.user.email });
    if (!userinDB) {
      return res.status(404).json({ error: "User not found" });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(
      `You are an AI assistant. Use the following past chat context to maintain continuity.
        Do NOT comment on the context like "thanks for sharing" or summarize it. Simply use it for understanding.
        Keep your responses short, helpful, and on-topic.
        --- Chat History ---
        ${userinDB.pastChats}
        --- End of History ---
        Now answer the user's current prompt:
        "${prompt}"`
    );
    const response = await result.response;
    const text = response.text();
    userinDB.pastChats += `\nUser: ${prompt}\nAI: ${text}`;
    userinDB.markModified("pastChats");

    let chats = userinDB.pastChats.trim().split("\n");

    if (chats.length > 200) {
      let newChats = [];
      let skipPairs = 0;
      for (let i = 0; i < chats.length; i++) {
        if (chats[i].startsWith("User:") && skipPairs < 6) {
          skipPairs++;
          continue;
        }
        if (skipPairs > 0 && chats[i].startsWith("AI:")) {
          skipPairs--;
          continue;
        }
        newChats.push(chats[i]);
      }
      userinDB.pastChats = newChats.join("\n");
    }

    await userinDB.save();

    res.json({ reply: text });
  } catch (err) {
    console.error("Gemini API call failed:", err.message);
    res.status(500).json({ error: "Gemini API call failed" });
  }
};
