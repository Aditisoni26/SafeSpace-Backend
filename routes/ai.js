const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ message: "OPENROUTER_API_KEY missing" });
    }

    const { prompt } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
       model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    const raw = response?.data?.choices?.[0]?.message?.content || "";

    const cleaned = raw
      .replace(/<\/?s>/gi, "")
      .replace(/\[\/s\]/gi, "")
      .trim();

    return res.json({
      result: cleaned || "AI responded but returned empty text.",
    });

  } catch (err) {
    console.error("❌ AI ERROR:", err.code || err.message);

    if (err.code === "ECONNABORTED") {
      return res.status(504).json({ message: "AI timed out. Try again." });
    }

    return res.status(500).json({ message: "AI chat failed safely." });
  }
});

module.exports = router;
