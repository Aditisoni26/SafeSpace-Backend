const axios = require("axios");
const express = require("express");
const router = express.Router(); // ✅ correct

router.get("/nearby", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    console.warn("⚠️ Invalid coordinates received:", { lat, lng });
    return res.status(400).json({ message: "Invalid latitude or longitude" });
  }

  const query = `
[out:json];
(
  node["amenity"="police"](around:5000,${lat},${lng});
  way["amenity"="police"](around:5000,${lat},${lng});
  relation["amenity"="police"](around:5000,${lat},${lng});
);
out center;
`.trim();

  try {
    console.log("📡 Sending Overpass query:", query);
    const OVERPASS_URL = "https://overpass.kumi.systems/api/interpreter";

    const response = await axios.post(OVERPASS_URL, query, {
      headers: { "Content-Type": "text/plain" },
      timeout: 10000, // ⏱️ 10 seconds
    });

    const results = response.data.elements.map((el) => ({
      name: el.tags?.name || "Unnamed Police Station",
      lat: el.lat || el.center?.lat,
      lon: el.lon || el.center?.lon,
      address: `${el.tags?.["addr:street"] || ""} ${
        el.tags?.["addr:city"] || ""
      }`.trim(),
    }));

    res.json({ results });
  } catch (err) {
    console.error("❌ Overpass API Error:", err.message);
    res.status(500).json({ message: "Failed to fetch police stations." });
  }
});

module.exports = router;
