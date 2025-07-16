// utils/sendEmail.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const sendEmail = async(to, subject, text) => {
    try {
        await transporter.sendMail({
            from: `"SafeSpace" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
        });
        console.log("✅ Email sent to:", to);
    } catch (error) {
        console.error("❌ Email error:", error.message);
    }
};

module.exports = sendEmail;