export default async function handler(req, res) {
    // 1. Security check: Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 2. Parse the incoming data safely
        // This ensures that even if the data arrives in different formats, we can read it.
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { character, bio, message, history } = body;

        // 3. Prepare the conversation for the AI
        // We combine: The Personality (System) + The Memory (History) + The New Message (User)
        const chatMessages = [
            { "role": "system", "content": `You are ${character}. ${bio}` },
            ...(history || []), // If history is empty, it just skips this part
            { "role": "user", "content": message }
        ];

        // 4. Talk to OpenRouter
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemini-2.0-flash-001",
                "messages": chatMessages,
                "temperature": 0.7 // This makes them sound more natural/human
            })
        });

        const data = await response.json();

        // 5. Check for OpenRouter errors (like out of balance)
        if (data.error) {
            console.error("OpenRouter Error:", data.error);
            return res.status(500).json({ error: data.error.message });
        }

        // 6. Send the AI's reply back to your website
        const aiReply = data.choices[0].message.content;
        res.status(200).json({ reply: aiReply });

    } catch (err) {
        console.error("Server Crash:", err);
        res.status(500).json({ error: "Server error: " + err.message });
    }
}
