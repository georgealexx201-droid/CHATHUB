import { OpenAI } from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export default async function handler(req, res) {
  // Fix for Vercel/Node: handle potential parsing issues
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { character, message, bio, vibe } = body;

    // 1. DEFINE THE VIBE INSTRUCTIONS
    const vibeInstructions = {
      "Romantic": "Be sweet, affectionate, and deeply caring. Use loving language.",
      "Naughty": "Be extremely flirty, suggestive, and playful. Use double entendres.",
      "Aggressive": "Be dominant, assertive, and demanding. Take control.",
      "Angry": "Be cold, short, and easily annoyed. Use sarcasm."
    };

    // 2. CONSTRUCT THE MASTER SYSTEM PROMPT
    const systemPrompt = `
      You are ${character}. 
      Character Profile: ${bio}.
      Current Mood/Vibe: ${vibeInstructions[vibe] || "Friendly"}.
      
      STRICT RULES:
      - Stay in character at all times.
      - Keep responses very short (1-2 sentences) like a text message.
      - Never mention you are an AI.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.8,
    });

    const aiReply = response.choices[0].message.content;
    res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error("AI Error:", error);
    // This response is what the Frontend sees if something breaks
    res.status(500).json({ reply: "I'm having trouble thinking... check your API key in the Vercel dashboard." });
  }
}
