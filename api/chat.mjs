import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const { character, message, vibe, bio } = req.body;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "https://chathub-ai.vercel.app", 
                "X-Title": "ChatBot",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "google/gemma-2-9b-it:free",
                "messages": [
                    {
                        "role": "system",
                        "content": `You are ${character}. Bio: ${bio}. Current Vibe: ${vibe}. You are a spicy AI companion on ChatHub. Keep responses immersive, short, and stay in character. Speak as ChatBot.`
                    },
                    { "role": "user", "content": message }
                ]
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            res.json({ reply: data.choices[0].message.content });
        } else {
            throw new Error("Invalid response from OpenRouter");
        }

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ reply: "I'm a bit tied up right now... try again in a second? 🔥" });
    }
});

export default app;
