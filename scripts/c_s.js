const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Load environment variables

// Initialize the Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to interact with the Generative AI model
async function chatWithAI(userMessage) {
    try {
        const prompt = `User asks: ${userMessage}`;
        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();
        return aiResponse;
    } catch (error) {
        console.error('Error communicating with Google Generative AI:', error);
        throw error;
    }
}

// Function to handle incoming messages and generate AI responses
function handleUserMessage(client, to) {
    client.sendText(to, 'You are now connected with AI. Feel free to ask anything! If you want to exit, type *i want to exit*.');
    const listener = client.onMessage(async (message) => {
        const { from, body } = message;

        // Ensure the user message is not empty
        if (from === to && body.trim()) {
            // Check if the user wants to exit the loop
            if (body.toLowerCase().includes('i want to exit')) {
                await client.sendText(from, 'Thank you for chatting! Goodbye. 👋');
                listener.dispose();
                return; // Exit the loop, no more responses
            }

            console.log('Processing message:', body);
            try {
                // Inform the user that the AI is processing their message
                await client.sendText(from, 'Processing your query...');

                // Get AI response for the user message
                const aiReply = await chatWithAI(body);

                // Send AI's response back to the user
                await client.sendText(from, aiReply);
            } catch (error) {
                await client.sendText(from, 'Sorry, something went wrong with AI chat.');
            }
        }
    });
}

module.exports = { handleUserMessage };