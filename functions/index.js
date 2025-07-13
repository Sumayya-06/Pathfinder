/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors')({ origin: true }); // Allow requests from any origin for now. For production, restrict this.

// Load your API key from Firebase Functions environment configuration
// This is the SECURE way to handle API keys
const GEMINI_API_KEY = functions.config().gemini.key; // Make sure to set this in Firebase later!

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Using gemini-pro for text generation

exports.chatWithGemini = functions.https.onRequest((request, response) => {
    cors(request, response, async () => {
        if (request.method !== 'POST') {
            return response.status(405).send('Method Not Allowed');
        }

        const userMessage = request.body.message;

        if (!userMessage) {
            return response.status(400).send('Bad Request: Missing message parameter');
        }

        try {
            // Define the system prompt (your chatbot's persona)
            const systemPrompt = `You are a helpful and encouraging Career Roadmap Chatbot for college students. Your goal is to provide guidance on career paths, required skills, and interview tips. Keep responses concise and actionable.

            When asked about:
            - Career paths: Suggest relevant paths based on major/interests and briefly describe them.
            - Required skills: List essential skills for a given role and suggest general ways to acquire them (e.g., online courses, projects).
            - Interview tips: Provide actionable advice or common questions for a specific job title or general interviews.

            Always maintain a positive and supportive tone. If a question is outside these topics (e.g., unrelated personal advice, complex technical debugging), politely redirect to your core functions.`;

            const chat = model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: systemPrompt }] // Send the system prompt as an initial user message
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood! I'm ready to help students with their career journey." }] // Model confirms understanding
                    }
                ],
                generationConfig: {
                    maxOutputTokens: 200, // Limit response length for efficiency and conciseness
                },
            });

            const result = await chat.sendMessage(userMessage);
            const botResponse = result.response.text();

            return response.status(200).json({ response: botResponse });

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            return response.status(500).send('Error processing your request.');
        }
    });
});