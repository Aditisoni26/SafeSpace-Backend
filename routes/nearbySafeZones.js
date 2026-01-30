const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and Longitude are required." });
    }

    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="police"](around:5000,${lat},${lng});
        way["amenity"="police"](around:5000,${lat},${lng});
        relation["amenity"="police"](around:5000,${lat},${lng});
      );
      out center tags;
    `;

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { headers: { "Content-Type": "text/plain" }, timeout: 20000 }
    );

    const elements = response.data?.elements || [];

    if (elements.length === 0) {
      return res.json({ safeZones: [] });
    }

    const safeZones = elements.map((el) => ({
      lat: el.lat || el.center?.lat,
      lon: el.lon || el.center?.lon,
      name: el.tags?.name || "Police Station",
      address:
        el.tags?.["addr:full"] ||
        el.tags?.["addr:street"] ||
        "Address not available"
    }));

    res.json({ safeZones });
  } catch (err) {
    console.error("❌ Overpass Error:", err.message);
    res.status(500).json({
      message: "Failed to fetch police stations."
    });
  }
});

module.exports = router;
