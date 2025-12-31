export const geminiChat = async (req, res) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: req.body.prompt || "Write a friendly greeting message for a user in Urdu",
          temperature: 0.7,
          maxOutputTokens: 100,
        }),
      }
    );

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Gemini API failed" });
  }
};
