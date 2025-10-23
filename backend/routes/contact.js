import express from 'express';
import { getContacts, seedContacts } from '../controllers/contactController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getContacts);

// Route to seed initial data (optional, maybe protect it further or remove after use)
router.post('/seed', auth, seedContacts);

export default router;