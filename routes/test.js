// const express = require("express");
// const router = express.Router();
// const { sendWhatsApp, sendEmail } = require("../utils/twilioService");

// router.get("/test-alert", async(req, res) => {
//     const testPhone = 'whatsapp:+91YOUR_NUMBER'; // replace with your verified number
//     const testEmail = 'your_email@gmail.com'; // replace with your email

//     const message = "🚨 This is a test alert from SafeSpace.";
//     try {
//         await sendWhatsApp(testPhone, message);
//         await sendEmail(testEmail, "🚨 Test Alert", message);
//         res.send("✅ Test messages sent via WhatsApp and Email");
//     } catch (err) {
//         console.error("❌ Error:", err.message);
//         res.status(500).send("❌ Failed to send test alerts");
//     }
// });

// module.exports = router;
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/overpass-test", async(req, res) => {
    const query = `
[out:json];
node["amenity"="police"](around:5000,22.9734229,78.6568942);
out center;
`.trim();

    try {
        const response = await axios.post("https://overpass.kumi.systems/api/interpreter", query, {
            headers: { "Content-Type": "text/plain" },
            timeout: 10000,
        });

        console.log("✅ Overpass response:", response.data);
        res.json({ message: "Success", data: response.data });
    } catch (err) {
        console.error("❌ Overpass test failed:", err.message);
        res.status(500).json({ message: "Overpass test failed", error: err.message });
    }
});

module.exports = router;