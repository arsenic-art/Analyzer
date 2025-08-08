const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const connectDB = require("./config/database");
const User = require("./models/UserSchema");
const { AuthMiddleware } = require("./middlewares/AnalyzerAuth");
const { getChats } = require("./controllers/getYourChats");
const { leetcode } = require("./controllers/leetcode");
const { codeforces } = require("./controllers/codeforces");
const { atcoder } = require("./controllers/atcoder");
const { gfg } = require("./controllers/gfg");

const app = express();
app.use(cookieParser());
const allowedOrigins = [
  "https://analyzer-piyushsharma.vercel.app",
  /^https:\/\/.*\.vercel\.app$/ // match any Vercel deployment URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => 
      (typeof o === "string" && o === origin) ||
      (o instanceof RegExp && o.test(origin))
    )) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

app.use(express.json());
const generateToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

app.get("/leetcode/:id", leetcode);
app.get("/codeforces/:id", codeforces);
app.get("/atcoder/:id", atcoder);
app.get("/geeksforgeeks/:id", gfg);

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();

    const token = generateToken(email);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser.toJSON(),
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(email);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful" });
});

app.post("/setChats", AuthMiddleware, getChats);

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
