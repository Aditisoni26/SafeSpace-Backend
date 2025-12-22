const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const authHeader = req.header("Authorization");
    console.log("🔐 Incoming request auth header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; // 🔥 normalize here
        next();
    } catch (err) {
        console.error("❌ JWT verify failed:", err.message);
        return res.status(401).json({ message: "Invalid token." });
    }
};