export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Wrong method' });

    // --- YOUR NEW KEY APPLIED ---
    const KEY = "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"; 

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://chathub-ai-candy.vercel.app", 
                "X-Title": "Candy AI Clone"
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-001",
                messages: req.body.messages
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error("OpenRouter Error Details:", data.error);
            return res.status(500).json({ error: data.error.message });
        }
        
        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ error: "Server failed to connect to OpenRouter." });
    }
}
