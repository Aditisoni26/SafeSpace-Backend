// utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async(to, subject, text) => {
    console.log("📤 Sending email to:", to);

    const info = await transporter.sendMail({
        from: `"SafeSpace" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    });

    console.log("✅ Email sent:", info.messageId);
};

module.exports = sendEmail;