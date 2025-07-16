// routes/alert.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Alert = require('../models/Alert'); // Make sure Alert model exists

// Existing emergency alert POST route
router.post('/', authMiddleware, async(req, res) => {
    try {
        const { location, message } = req.body;
        const alert = new Alert({
            user: req.user.id,
            location,
            message,
        });
        await alert.save();

        console.log("🔔 Emergency alert saved:", alert);
        res.status(200).json({ message: '🚨 Emergency alert received successfully!' });
    } catch (err) {
        console.error("Alert error:", err);
        res.status(500).json({ message: 'Failed to send alert' });
    }
});

// ✅ Add this route to fetch alerts
router.get('/my-alerts', authMiddleware, async(req, res) => {
    try {
        const alerts = await Alert.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(alerts);
    } catch (err) {
        console.error("Fetch alerts error:", err);
        res.status(500).json({ message: 'Failed to fetch alerts' });
    }
});

module.exports = router;