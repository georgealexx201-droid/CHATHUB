import { OpenAI } from 'openai';

const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
    // Add these if your OpenAI dashboard shows them, otherwise leave them out
    // organization: process.env.OPENAI_ORG_ID, 
    // project: process.env.OPENAI_PROJECT_ID, 
});

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { character, message, bio, vibe } = body;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use 'mini' for better compatibility
            messages: [
                { role: "system", content: `You are ${character}. Bio: ${bio}. Vibe: ${vibe}.` },
                { role: "user", content: message }
            ],
        });

        return res.status(200).json({ reply: response.choices[0].message.content });

    } catch (error) {
        console.error("DEBUG:", error);
        // This will print the EXACT reason in your Vercel Runtime Logs
        return res.status(500).json({ reply: `Server says: ${error.message}` });
    }
}
