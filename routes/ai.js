const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct", // you can also try: 'meta-llama/llama-3-8b-instruct'
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", // Optional: your site
          "X-Title": "SafeSpace Chat",              // Optional: app name
        },
      }
    );

   res.json({
  result: response.data.choices?.[0]?.message?.content || "No AI response"
});

  } catch (error) {
    console.error("❌ OpenRouter Error:", error.response?.data || error.message);
    res.status(500).json({ message: "AI chat failed" });
  }
});

module.exports = router;
