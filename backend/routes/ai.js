import express from 'express';
import { getAIResponse } from '../utils/aiService.js';

const router = express.Router();

// @route   POST /api/chat
// @desc    Get a response from the chatbot
// @access  Public
router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ msg: 'Message is required' });
  }

  try {
    const aiMessage = await getAIResponse(message);
    res.json({ reply: aiMessage });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

export default router;