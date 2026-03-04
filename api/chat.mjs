import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_KEY, // This looks for your secret variable in Vercel
  defaultHeaders: {
    "HTTP-Referer": "https://chathub-ai.vercel.app", 
    "X-Title": "ChatHub AI",
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ reply: 'Method Not Allowed' });

  try {
    const { character, message, bio, vibe } = req.body;

    const vibeMap = {
      "Romantic": "Affectionate, sweet, and romantic.",
      "Naughty": "Extremely flirty and suggestive.",
      "Aggressive": "Dominant and bold.",
      "Angry": "Cold and sarcastic."
    };

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001", 
      messages: [
        { 
          role: "system", 
          content: `Roleplay as ${character}. Bio: ${bio}. Vibe: ${vibeMap[vibe] || 'Friendly'}. Max 2 sentences.` 
        },
        { role: "user", content: message }
      ],
    });

    return res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ reply: error.message });
  }
}
