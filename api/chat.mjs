export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // --- CONFIGURATION ---
    // Make sure this key is fresh! 
    const MY_API_KEY = "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"; 
    const AI_MODEL = "google/gemini-2.0-flash-001";

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${MY_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://chathub-ai.vercel.app", // Your site URL
                "X-Title": "ChatHub AI"
            },
            body: JSON.stringify({
                model: AI_MODEL,
                messages: req.body.messages, // Receives history from index.html
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error("OpenRouter Error:", data.error);
            return res.status(500).json({ error: data.error.message });
        }

        return res.status(200).json(data);

    } catch (err) {
        return res.status(500).json({ error: "Connection to AI provider failed." });
    }
}
