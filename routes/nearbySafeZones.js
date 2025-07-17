const axios = require("axios");
const express = require("express");
const router = express.Router(); // ✅ correct

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and Longitude are required." });
    }

    const query = `
      [out:json];
      (
        node["amenity"="police"](around:10000,${lat},${lng});
        way["amenity"="police"](around:10000,${lat},${lng});
        relation["amenity"="police"](around:10000,${lat},${lng});
      );
      out center;
    `;

    console.log("📍 Latitude:", lat);
    console.log("📍 Longitude:", lng);
    console.log("🧾 Overpass Query:\n", query);

    const response = await axios.post(
      "https://overpass-api.de/api/interpreter",
      query,
      { headers: { "Content-Type": "text/plain" } }
    );

    const elements = response.data.elements;

    const safeZones = elements.map((el) => {
      const lat = el.lat || el.center?.lat;
      const lon = el.lon || el.center?.lon;
      const name = el.tags?.name || "Police Station";
      return { lat, lon, name };
    });

    res.json({ safeZones });
  } catch (err) {
    console.error("❌ Overpass Error:", err.message);
    res.status(500).json({
      message: "Failed to fetch police stations.",
      error: err.message,
    });
  }
});


module.exports = router;
