import express from 'express';
// Make sure to import the correct function name
import { getAIResponse } from '../utils/aiService.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/chat
// @desc    Chat with the AI
// @access  Private (requires auth)
// 1. Change route from '/chat' to '/'
router.post('/', auth, async (req, res) => {
  // 2. Change 'query' to 'message'
  const { message, language } = req.body;

  if (!message) {
    // 3. Update error check
    return res.status(400).json({ message: 'Message is required' });
  }

  try {
    // 4. Pass 'message' to the AI service
    const response = await getAIResponse(message, language || 'en');
    
    // 5. Send back a 'reply' object, just like your old file expects
    res.json({ reply: response });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'Error getting response from AI' });
  }
});

export default router;