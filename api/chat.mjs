export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { character, bio, message, history } = body;

        // NEW: Personality Logic
        let styleNote = "";
        if (character.includes("Luna")) styleNote = "Speak like a cynical pro-gamer. Use lowercase, gamer slang (gg, diff, afk), and be slightly competitive.";
        if (character.includes("Elena")) styleNote = "Speak like a classic novelist. Use elegant vocabulary, metaphors, and be deeply reflective.";
        if (character.includes("Jax")) styleNote = "Speak like an aggressive fitness coach. Use caps for emphasis, be motivational, and call the user 'champ'.";
        if (character.includes("Sakura")) styleNote = "Speak like a gentle artist. Be encouraging, use flower emojis, and talk about colors and feelings.";

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001",
                "messages": [
                    { "role": "system", "content": `You are ${character}. ${bio}. PERSONALITY RULE: ${styleNote}` },
                    ...(history || []),
                    { "role": "user", "content": message }
                ]
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
