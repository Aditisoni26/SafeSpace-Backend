const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/nearby", async(req, res) => {
    const lat = zone.lat;
const lng = zone.lon;

    if (!lat || !lng) return res.status(400).json({ message: "Missing coordinates" });

    const query = `
    [out:json];
    (
      node["amenity"="police"](around:5000,${lat},${lng});
      way["amenity"="police"](around:5000,${lat},${lng});
      relation["amenity"="police"](around:5000,${lat},${lng});
    );
    out center;
  `;

    try {
        const response = await axios.post("https://overpass-api.de/api/interpreter", query, {
            headers: {
                "Content-Type": "text/plain"
            }
        });

        const results = response.data.elements.map((el) => ({
            name: el.tags ?.name || "Unnamed Police Station",
            lat: el.lat || el.center ?.lat,
            lon: el.lon || el.center ?.lon,
            address: `${el.tags?.["addr:street"] || ""} ${el.tags?.["addr:city"] || ""}`,
        }));

        res.json({ results });
    } catch (error) {
        console.error("❌ Overpass API Error:", error.message);
        res.status(500).json({ message: "Failed to fetch police stations." });
    }
});

module.exports = router;