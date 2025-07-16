require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require("./routes/authRoutes");
const emergencyRoutes = require('./routes/emergency');
const testRoutes = require('./routes/test');
const aiRoutes = require("./routes/ai");
const safezoneRoutes = require('./routes/safezone');
const nearbySafeZonesRoutes = require("./routes/nearbySafeZones");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // ✅ must match frontend
    credentials: true // ✅ allow cookies/session
}));
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use('/api/test', testRoutes);
app.use("/api/ai", aiRoutes); // ✅ this is correct
app.use("/api/safezone", safezoneRoutes);
app.use("/api/nearby-safezones", nearbySafeZonesRoutes);
// Sample route
app.get('/', (req, res) => {
    res.send('SafeSpace Backend is Running');
});

// MongoDB connection and start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error("❌ MongoDB connection failed:", err));