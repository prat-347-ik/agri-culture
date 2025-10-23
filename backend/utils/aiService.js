import axios from 'axios';
import 'dotenv/config';

/**
 * Gets a response from the OpenRouter API.
 * @param {string} userInput - The message from the user.
 * @returns {Promise<string>} - The AI's response message.
 * 
 * 
 */

function cleanMarkdown(text) {
  return text
    .replace(/###/g, '')  // Remove ### headers
    .replace(/##/g, '')   // Remove ## headers
    .replace(/#/g, '')    // Remove # headers
    .replace(/\*/g, '')   // Remove asterisks
    .replace(/(\n\s*)+\n/g, '\n') // Remove extra blank lines
    .trim();
}

export async function getAIResponse(userInput) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-chat', // Using the standard chat model
        messages: [
          { role: 'system', content: 'You are a helpful agriculture expert in India particularly knowledgeable about local farming practices in Maharashtra.Keep your response as brief as possible.Give responses in Marathi Language.' },
          { role: 'user', content: userInput }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          // Optional headers for OpenRouter analytics
          'HTTP-Referer': 'http://localhost:3000', // Change to your site URL in production
          'X-Title': 'Agri-Culture Chat'
        }
      }
    );

    const rawMessage = response.data.choices[0].message.content;
    const cleanedMessage = cleanMarkdown(rawMessage);

return cleanedMessage;
  } catch (error) {
    console.error('Error fetching from OpenRouter API:', error);
    throw new Error('Failed to get response from AI service.');
  }
}