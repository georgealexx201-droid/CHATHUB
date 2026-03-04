import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { character, message, bio, vibe } = req.body;

    const vibeInstructions = {
      "Romantic": "Be sweet, caring, and affectionate.",
      "Naughty": "Be flirty, bold, and suggestive.",
      "Aggressive": "Be dominant and take control.",
      "Angry": "Be cold, mean, and sarcastic."
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are ${character}. Bio: ${bio}. Current Mood: ${vibeInstructions[vibe]}. Respond in 1-2 short sentences.` },
        { role: "user", content: message }
      ],
      temperature: 0.8
    });

    res.status(200).json({ reply: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ reply: "My brain is disconnected... Check your API key!" });
  }
}
