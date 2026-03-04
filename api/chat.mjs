import { OpenAI } from 'openai';

// This setup is more stable for Node 24 on Vercel
const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
    // If you have a Project ID in your OpenAI dashboard, add it to Vercel and uncomment below:
    // project: process.env.OPENAI_PROJECT_ID 
});

export default async function handler(req, res) {
    // Basic security check
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const { character, message, bio, vibe } = req.body;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Most stable for 2026
            messages: [
                { role: "system", content: `You are ${character}. Bio: ${bio}. Vibe: ${vibe}. Max 2 sentences.` },
                { role: "user", content: message }
            ],
            // Adding a timeout helps prevent "silent" connection hangs
            timeout: 15000 
        });

        return res.status(200).json({ reply: response.choices[0].message.content });

    } catch (error) {
        // This sends the EXACT error back to your chat screen so we can see it
        console.error("OpenAI Error:", error);
        return res.status(500).json({ 
            reply: `Server says: ${error.message || 'Unknown Connection Error'}` 
        });
    }
}
