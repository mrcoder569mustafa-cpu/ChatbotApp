import fetch from "node-fetch";

export const geminiChat = async (req, res) => {
  try {
    const API_KEY = process.env.GEMINI_API_KEY; // .env me ye variable hona chahiye

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Free model ka correct JSON format
          contents: [
            {
              parts: [
                {
                  text: req.body.prompt || "Write a friendly greeting message in Urdu"
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100
          }
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
