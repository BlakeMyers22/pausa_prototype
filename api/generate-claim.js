// File: api/generate-claim.js
import OpenAI from 'openai';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const { notes } = req.body;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an experienced insurance claims adjuster specializing in weather-related property damage assessment. Provide thorough, professional claim evaluations."
                },
                {
                    role: "user",
                    content: `Generate a professional insurance claim report for the following damage description: ${notes}`
                }
            ]
        });

        res.status(200).json({ claim_text: response.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to generate claim' });
    }
}
