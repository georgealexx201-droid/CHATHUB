import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    // Vercel sometimes parses the body automatically, sometimes not. This handles both.
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { character, message, bio, vibe } = data;

    const vibeMap = {
      "Romantic": "Be sweet, affectionate, and use emojis like 💖.",
      "Naughty": "Be flirty, suggestive, and very playful 😈.",
      "Aggressive": "Be dominant, bold, and take charge 🔥.",
      "Angry": "Be cold, short, and sarcastic 💢."
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `You are ${character}. Bio: ${bio}. Current Mood: ${vibeMap[vibe] || "Friendly"}. Keep responses to 1-2 short sentences.` 
        },
        { role: "user", content: message }
      ],
      temperature: 0.8,
    });

    res.status(200).json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ reply: "My circuits are fried... is your API key valid?" });
  }
}
