const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

exports.AuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.startsWith("Bearer ") 
    ? authHeader.split(" ")[1] 
    : null;
  
  const token = req.cookies.token || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access - No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};
