const User = require("../models/UserSchema");

exports.clearChats = async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userInDB = await User.findOne({ email: req.user.email });

    if (!userInDB) {
      return res.status(404).json({ error: "User not found" });
    }

    userInDB.pastChats = "";
    await userInDB.save();

    res.status(200).json({ message: "Chat history cleared successfully" });

  } catch (err) {
    console.error("Error clearing chat history:", err);
    res.status(500).json({ error: "Error clearing chat history" });
  }
};
