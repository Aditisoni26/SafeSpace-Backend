// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || "safesecret";

exports.signup = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Signup successful" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Create token (you can add expiry like { expiresIn: '1h' })
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};