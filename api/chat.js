export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { character, bio, message, history } = JSON.parse(req.body);

        // We combine the bio, the old messages, and the new message
        const messages = [
            { "role": "system", "content": `You are ${character}. ${bio}` },
            ...history, // This adds the previous conversation
            { "role": "user", "content": message }
        ];

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001",
                "messages": messages
            })
        });

        const data = await response.json();
        res.status(200).json({ reply: data.choices[0].message.content });

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
}
