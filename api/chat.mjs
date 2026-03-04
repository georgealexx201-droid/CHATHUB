import { OpenAI } from 'openai';

const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
});

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { character, message, bio, vibe } = body;

        const vibeMap = {
            "Romantic": "Be sweet, caring, and use hearts.",
            "Naughty": "Be flirty, suggestive, and bold.",
            "Aggressive": "Be dominant and take charge.",
            "Angry": "Be cold, mean, and sarcastic."
        };

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { 
                    role: "system", 
                    content: `You are ${character}. Bio: ${bio}. Mode: ${vibeMap[vibe] || "Friendly"}. Max 2 short sentences.` 
                },
                { role: "user", content: message }
            ],
            temperature: 0.8
        });

        const reply = response.choices[0].message.content;
        return res.status(200).json({ reply });

    } catch (error) {
        console.error("API Error:", error);
        // This tells you exactly what OpenAI said was wrong
        return res.status(500).json({ 
            reply: `AI Error: ${error.message}. Check your OpenAI balance!` 
        });
    }
}
