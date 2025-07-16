const mongoose = require("mongoose");

const emergencySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    location: {
        lat: Number,
        lng: Number,
    },
    message: String,
    videoUrl: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Emergency", emergencySchema);