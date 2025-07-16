// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const authHeader = req.header("Authorization");
    console.log("🔐 Incoming request auth header:", req.header("Authorization"));

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // 👈 Make sure this matches .env
        req.user = decoded;
        next();
    } catch (err) {
        console.error("❌ JWT verify failed:", err.message);
        res.status(401).json({ message: "Invalid token." });
    }
};