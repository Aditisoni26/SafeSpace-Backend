// utils/sendWhatsApp.js
const twilio = require("twilio");
require("dotenv").config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendWhatsApp = async(to, message) => {
    try {
        const msg = await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:${to}`, // make sure this has full +91xxxx format
            body: message,
        });

        console.log("✅ WhatsApp sent:", msg.to);
    } catch (error) {
        console.error("❌ WhatsApp Error:", error.message);
    }
};

module.exports = sendWhatsApp;