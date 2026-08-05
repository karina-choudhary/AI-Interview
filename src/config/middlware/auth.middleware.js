const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  console.log("========== AUTH ==========");
  console.log("Authorization:", req.headers.authorization);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("No Authorization Header");
      return res.status(401).json({
        message: "Token not found",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("JWT ERROR:", error.message);

    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};

module.exports = authMiddleware;