// utils/sendWhatsApp.js
const twilio = require("twilio");

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsApp = async(to, message) => {
    console.log("📤 Sending WhatsApp to:", to);

    const msg = await client.messages.create({
        from: "whatsapp:+14155238886", // ✅ sandbox number
        to: `whatsapp:${to}`,
        body: message,
    });

    console.log("✅ WhatsApp sent:", msg.sid);
};

module.exports = sendWhatsApp;