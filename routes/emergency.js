const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Alert = require("../models/Alert"); // ✅
const User = require("../models/User");
const sendWhatsApp = require("../utils/sendWhatsApp");
const sendEmail = require("../utils/sendEmail");
const verifyToken = require("../middleware/verifyToken");





// 🚨 Route 1: Send Alert
router.post("/", auth, async(req, res) => {
    const { location, message } = req.body;
    try {
        const newAlert = new Alert({
            user: req.user.id,
            location,
            message,
        });

        await newAlert.save();

        res.status(201).json({ message: "Emergency alert sent successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Failed to send alert" });
    }
});

// ✅ Route 2: Get All Alerts of User
router.get("/my-alerts", auth, async(req, res) => {
    try {
        const alerts = await Alert.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(alerts);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Failed to fetch alerts" });
    }
});

// ✅ Route 3: Send Alert to Trusted Contacts (SMS + Call)

// ✅ Route 3: Send Alert to Trusted Contacts (WhatsApp + Email)
router.post("/my-alerts/send", auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const { lat, lng } = req.body.location;

        const mapLink = `https://maps.google.com/?q=${lat},${lng}`;
        const message = `🚨 ${user.name} triggered an emergency!\n📍 Location: ${mapLink}`;

        for (const contact of user.trustedContacts) {
            let phone = contact.phone;

            // ✅ Add country code +91 if not present
            if (phone && !phone.startsWith("+")) {
                phone = "+91" + phone;
            }

            // ✅ Send WhatsApp message via Twilio
            if (phone) {
                await sendWhatsApp(phone, message);
            }

            // ✅ Send Email
            if (contact.email) {
                await sendEmail(contact.email, "🚨 Emergency Alert from SafeSpace", message);
            }
        }

        res.status(200).json({ message: "Contacts notified successfully!" });
    } catch (err) {
        console.error("❌ ALERT ERROR:", err.message);
        res.status(500).json({ message: "Failed to notify contacts." });
    }
});

// DELETE /api/emergency/my-alerts/:id
// DELETE /api/emergency/my-alerts/:id
router.delete("/my-alerts/:id", auth, async(req, res) => {
    try {
        const alertId = req.params.id;
        const userId = req.user._id || req.user.id;

        console.log("🚨 Deleting alert:", alertId, "for user:", userId);

        const alert = await Alert.findOne({ _id: alertId, user: userId });

        if (!alert) {
            return res.status(404).json({ error: "Alert not found or not authorized" });
        }

        await Alert.deleteOne({ _id: alertId });

        res.json({ message: "Alert deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting alert:", error);
        res.status(500).json({ error: "Server error while deleting alert" });
    }
});



// ✅ Route 4: Add Trusted Contact
router.post("/trusted-contacts", auth, async(req, res) => {
    const { name, phone, email } = req.body;
    const user = await User.findById(req.user.id);

    user.trustedContacts.push({ name, phone, email });
    await user.save();

    res.status(201).json({ message: "Trusted contact added", contacts: user.trustedContacts });
});

// ✅ Route 5: View Trusted Contacts
router.get("/trusted-contacts", auth, async(req, res) => {
    const user = await User.findById(req.user.id);
    res.json(user.trustedContacts);
});
// ✅ Route 6: Delete Trusted Contact
router.delete("/trusted-contacts/:id", auth, async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.trustedContacts = user.trustedContacts.filter(
            (contact) => contact._id.toString() !== req.params.id
        );
        await user.save();
        res.json({ message: "Trusted contact removed" });
    } catch (err) {
        console.error("❌ Delete Contact Error:", err.message);
        res.status(500).json({ message: "Failed to delete contact" });
    }
});
router.post('/store-recording', auth, async(req, res) => {
    try {
        const { videoUrl } = req.body;

        // ✅ Find the latest alert for the user
        const latestAlert = await Alert.findOne({ user: req.user.id }).sort({ createdAt: -1 });

        if (!latestAlert) {
            return res.status(404).json({ message: 'No alert found for this user.' });
        }

        // ✅ Update alert with video URL
        latestAlert.videoUrl = videoUrl;

        // ❗ Optional: don't update status if you don't use "recorded"
        // latestAlert.status = 'recorded';

        await latestAlert.save();

        res.status(200).json({ message: 'Recording saved successfully', alert: latestAlert });
    } catch (err) {
        console.error('❌ Store recording error:', err);
        res.status(500).json({ message: 'Failed to save recording' });
    }
});



module.exports = router;