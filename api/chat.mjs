import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const { character, message, bio, vibe } = JSON.parse(req.body);

    const vibeMap = {
      "Romantic": "Affectionate, sweet, and deeply in love.",
      "Naughty": "Extremely flirty, suggestive, and bold.",
      "Aggressive": "Dominant, controlling, and assertive.",
      "Angry": "Cold, sarcastic, and easily annoyed."
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are ${character}. Bio: ${bio}. Current Mood: ${vibeMap[vibe] || 'Friendly'}. Keep responses to 2 sentences max.` },
        { role: "user", content: message }
      ],
    });

    return res.status(200).json({ reply: completion.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ reply: "My circuits are fried... check your API key!" });
  }
}
