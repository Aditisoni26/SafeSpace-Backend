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
const nearbyRoutes = require("./routes/nearbySafeZones");


// Load environment variables
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
    'https://safe-space-frontend-psi.vercel.app',
    /\.vercel\.app$/ // for preview deployments
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.some(o =>
                typeof o === 'string' ? o === origin : o.test(origin)
            )) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    // ❌ REMOVE credentials
    // credentials: true,
}));



// Routes
// app.use("/api", authRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use('/api/test', testRoutes);
app.use("/api/ai", aiRoutes); // ✅ this is correct
app.use("/api/safezone", safezoneRoutes);
app.use("/api/nearby", nearbyRoutes);
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