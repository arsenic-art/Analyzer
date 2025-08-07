const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

exports.AuthMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Invalid token or expired" });
      }
        req.user = decoded;
        return next(); 
    });
  } catch (error) {
    console.error("Error in AuthMiddleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
 