const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("auth_token");
  if (!token) {
    return res.status(401).json({ error: true, message: "Access Denied" });
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: true, message: "Invalid Token" });
  }
};

module.exports = { verifyToken };
