const twilio = require('twilio');
const nodemailer = require('nodemailer');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

const sendWhatsApp = async(to, body) => {
    try {
        await twilioClient.messages.create({
            from: 'whatsapp:+14155238886', // Twilio sandbox number
            to: `whatsapp:${to}`,
            body
        });
        console.log("✅ WhatsApp sent to", to);
    } catch (err) {
        console.error("❌ WhatsApp Error:", err.message);
    }
};

const sendEmail = async(to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS // Your app password
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent to", to);
    } catch (err) {
        console.error("❌ Email Error:", err.message);
    }
};

module.exports = { sendWhatsApp, sendEmail };