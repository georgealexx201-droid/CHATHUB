import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  // PRIVATE WAY: Use the variable name you set in Vercel Settings
  apiKey: process.env.OPENROUTER_KEY || "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",
  defaultHeaders: {
    "HTTP-Referer": "https://chathub-ai.vercel.app",
    "X-Title": "ChatHub AI Empire",
  }
});

export default async function (req, res) {
  // Vercel sometimes sends a string, we need an object
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { character, message, bio, vibe } = body;

  try {
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001", 
      messages: [
        { role: "system", content: `Roleplay as ${character}. Bio: ${bio}. Vibe: ${vibe}. Reply in 1-2 sentences.` },
        { role: "user", content: message }
      ],
    });

    res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ reply: "API Error: " + error.message });
  }
}
