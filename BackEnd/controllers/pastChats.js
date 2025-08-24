const User = require("../models/UserSchema");

exports.previousChats = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userInDB = await User.findOne({ email: req.user.email });

    if (!userInDB) {
      return res.status(404).json({ error: "User not found" });
    }

    const pastChats = userInDB.pastChats || "";
    const chatHistory = pastChats.trim().split("\n").filter(line => line);

    res.status(200).json({ history: chatHistory });

  } catch (err) {
    console.error("Error retrieving past chats:", err);
    res.status(500).json({ error: "Error retrieving chat history" });
  }
};
