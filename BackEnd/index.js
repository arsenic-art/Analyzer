const express = require("express");
const app = express();
const { leetcode } = require("./controllers/leetcode");
const { codeforces } = require("./controllers/codeforces");
const { atcoder } = require("./controllers/atcoder");
const { gfg } = require("./controllers/gfg");
const cors = require("cors");
const connectDB = require("./config/database");
const User = require("./models/UserSchema");
const jwt = require("jsonwebtoken");
const { AuthMiddleware } = require("./middlewares/AnalyzerAuth");
const { getChats } = require("./controllers/getYourChats");
const cookieParser = require("cookie-parser");

require("dotenv").config();

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.get("/leetcode/:id", leetcode);
app.get("/codeforces/:id", codeforces);
app.get("/atcoder/:id", atcoder);
app.get("/geeksforgeeks/:id", gfg);

app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const new_user = new User({ firstName, lastName, email, password });
    await new_user.save();
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ message: "User registered successfully", token, user: new_user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "Login successful", token, user });
  }
  catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
})

app.post('/setChats', AuthMiddleware, getChats);

const PORT = 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
