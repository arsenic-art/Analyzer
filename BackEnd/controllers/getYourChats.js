const express = require("express");

require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const User = require("../models/UserSchema");
const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

exports.getChats = async (req, res) => {
  const { prompt } = req.body;

  if (!req.user || !req.user.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const userinDB = await User.findOne({ email: req.user.email });
    if (!userinDB) {
      return res.status(404).json({ error: "User not found" });
    }
    let chats = userinDB.pastChats?.trim().split("\n") || [];
    let pairs = [];
    for (let i = 0; i < chats.length; i += 2) {
      pairs.push([chats[i], chats[i + 1]]);
    }
    let contextPairs = pairs.slice(-15);
    let contextString = contextPairs.flat().join("\n");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(
      `You are an AI assistant integrated into an app called "Analyzer," designed to analyze users' competitive programming profiles. The app was developed by Piyush Sharma, and so were you.  
      Use the provided past chat context to maintain continuity, but do NOT mention or comment on the context itself.  
      Keep responses short, focused, and helpful. Analyze the user's competitive programming performance based on the provided summarized data. Highlight coding skills, problem-solving patterns, strengths, and areas for improvement.  
      For GeeksforGeeks (GFG), note that "maxStreak" refers to the global maximum streak, while "currentStreak" refers to the user’s personal maximum streak.  
      At the end, provide a brief summary. Format your response using Markdown with headings, lists, and **bold text** for clarity.  
      --- Chat History ---  
      ${contextString}  
      --- End of History ---  
      Now answer the current user prompt:  
      "${prompt}"`
    );

    const text = result.response.text();
    userinDB.pastChats =
      (userinDB.pastChats || "") + `\nUser: ${prompt}\nAI: ${text}`;
    userinDB.markModified("pastChats");
    let allPairs = userinDB.pastChats.trim().split("\n");
    if (allPairs.length > 1000) {
      let trimmedPairs = allPairs.slice(-1000);
      userinDB.pastChats = trimmedPairs.join("\n");
    }

    await userinDB.save();
    res.json({ reply: text });
  } catch (err) {
    console.error("Gemini API call failed:", err);
    res.status(500).json({ error: "Gemini API call failed" });
  }
};
