const nodemailer = require("nodemailer");
const twilio = require("twilio");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async(to, subject, text) => {
    const mailOptions = {
        from: `"SafeSpace Alerts" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);
};

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


async function sendWhatsApp(toNumber, message) {
    try {
        const msg = await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: `whatsapp:${toNumber}`,
            body: message,
        });
        console.log('✅ WhatsApp message sent:', msg.sid);
    } catch (err) {
        console.error('❌ WhatsApp message failed:', err.message);
    }
}

module.exports = { sendEmail, sendWhatsApp };