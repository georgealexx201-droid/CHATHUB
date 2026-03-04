import { OpenAI } from 'openai'; // Or your preferred provider

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { character, message, bio, vibe, history } = JSON.parse(req.body);

  // 1. DEFINE THE VIBE INSTRUCTIONS
  const vibeInstructions = {
    "Romantic": "Be sweet, affectionate, and deeply caring. Use loving language and focus on emotional connection.",
    "Naughty": "Be extremely flirty, suggestive, and playful. Use double entendres and be very bold.",
    "Aggressive": "Be dominant, assertive, and demanding. Take control of the conversation with high energy.",
    "Angry": "Be cold, short, and easily annoyed. Use sarcasm and act like the user has upset you."
  };

  // 2. CONSTRUCT THE MASTER SYSTEM PROMPT
  const systemPrompt = `
    You are ${character}. 
    Character Profile: ${bio}.
    Current Mood/Vibe: ${vibeInstructions[vibe] || "Friendly"}.
    
    STRICT RULES:
    - Stay in character at all times.
    - Keep responses concise (2-3 sentences max) to mimic a chat app.
    - Never mention you are an AI.
    - Match the 'Current Mood' intensity perfectly.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or gpt-4
      messages: [
        { role: "system", content: systemPrompt },
        ...history, 
        { role: "user", content: message }
      ],
      temperature: 0.8, // Higher temperature makes the "Vibes" more distinct
    });

    const aiReply = response.choices[0].message.content;

    res.status(200).json({ reply: aiReply });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ reply: "Sorry, I'm feeling a bit disconnected right now..." });
  }
}
