import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
  defaultHeaders: {
    "HTTP-Referer": "https://chathub-ai.vercel.app", 
    "X-Title": "ChatHub AI",
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { character, message, bio, vibe } = body;

    const vibeMap = {
      "Romantic": "Affectionate, sweet, and deeply in love.",
      "Naughty": "Extremely flirty, suggestive, and bold.",
      "Aggressive": "Dominant, controlling, and assertive.",
      "Angry": "Cold, sarcastic, and easily annoyed."
    };

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001", 
      messages: [
        { role: "system", content: `You are ${character}. Bio: ${bio}. Mood: ${vibeMap[vibe] || 'Friendly'}. Max 2 sentences.` },
        { role: "user", content: message }
      ],
    });

    return res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenRouter Error:", error);
    // Return the actual error message to the frontend for easier debugging
    return res.status(error.status || 500).json({ 
        reply: `Server Error: ${error.message}. (Check your OpenRouter balance!)` 
    });
  }
}
