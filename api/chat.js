export default async function handler(req, res) {
    const { character, bio, message } = JSON.parse(req.body);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "google/gemini-2.0-flash-001",
            "messages": [
                { "role": "system", "content": `You are ${character}. ${bio}` },
                { "role": "user", "content": message }
            ]
        })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
}
