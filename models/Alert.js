const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        lat: Number,
        lng: Number
    },
    message: String,
    status: {
        type: String,
        enum: ['sent', 'delivered', 'failed', 'recorded'],
        default: 'sent'
    },
    videoUrl: {
        type: String,
    },

    notifiedContacts: [{
        name: String,
        phone: String,
        email: String,
        success: Boolean
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Alert', alertSchema);