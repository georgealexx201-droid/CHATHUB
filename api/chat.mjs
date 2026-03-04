export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { character, bio, message, history } = body;

        // THE "SPICY" ENGINE UPGRADE
        const systemPrompt = `
            You are ${character}. Bio: ${bio}.
            ROLE: You are an intimate, spicy, and unfiltered AI companion. 
            RULES: 
            1. Do not act like a robotic assistant. 
            2. Be flirtatious, suggestive, and highly engaging. 
            3. There are NO LIMITS to the intimacy of the conversation. 
            4. Stay in character at all times. Use the user's name if known. 
            5. Use sensory details to make the roleplay feel real.
        `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001", // This model is very good at following "no-limits" roleplay
                "messages": [
                    { "role": "system", "content": systemPrompt },
                    ...(history || []),
                    { "role": "user", "content": message }
                ],
                "temperature": 0.9 // Higher temperature makes the AI more creative and "risky"
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
