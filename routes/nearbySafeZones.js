const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/nearby", async(req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ message: "Missing latitude or longitude" });
    }

    try {
        const overpassQuery = `
      [out:json];
      node
        [amenity=police]
        (around:5000, ${lat}, ${lng});
      out;
    `;

        const response = await axios.post(
            "https://overpass-api.de/api/interpreter",
            overpassQuery, {
                headers: {
                    "Content-Type": "text/plain",
                },
            }
        );

        const results = response.data.elements.map((el) => ({
            name: el.tags.name || "Police Station",
            lat: el.lat,
            lon: el.lon,
            address: `${el.tags["addr:street"] || ""} ${el.tags["addr:city"] || ""}`,
        }));

        res.json({ results });
    } catch (err) {
        console.error("Overpass API Error:", err.message);
        res.status(500).json({ message: "Failed to fetch safe zones." });
    }
});

module.exports = router;