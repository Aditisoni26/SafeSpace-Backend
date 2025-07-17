const express = require("express");
const router = express.Router();
const { sendWhatsApp, sendEmail } = require("../utils/twilioService");

router.get("/test-alert", async(req, res) => {
    const testPhone = 'whatsapp:+91YOUR_NUMBER'; // replace with your verified number
    const testEmail = 'your_email@gmail.com'; // replace with your email

    const message = "🚨 This is a test alert from SafeSpace.";
    try {
        await sendWhatsApp(testPhone, message);
        await sendEmail(testEmail, "🚨 Test Alert", message);
        res.send("✅ Test messages sent via WhatsApp and Email");
    } catch (err) {
        console.error("❌ Error:", err.message);
        res.status(500).send("❌ Failed to send test alerts");
    }
});

module.exports = router;