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
const allowedOrigins = [
    'https://safe-space-frontend-psi.vercel.app',
    /\.vercel\.app$/ // Allow all Vercel preview deployments
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.some(o => {
                if (typeof o === 'string') return o === origin;
                if (o instanceof RegExp) return o.test(origin);
                return false;
            })) {
            callback(null, true);
        } else {
            callback(new Error('❌ Not allowed by CORS: ' + origin));
        }
    },
    credentials: true,
}));


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